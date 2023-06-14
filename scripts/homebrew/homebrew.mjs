#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import crypto from "crypto";
import execa from "execa";
import fs from "fs";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const packageJsonPath = "../../apps/cli/package.json";
const packageJson = JSON.parse(
  readFileSync(new URL(packageJsonPath, import.meta.url)),
);

const VERSION = packageJson.version;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { GITHUB_SHA_SHORT } = process.env;

async function getEnvlessFormulaTemplate() {
  const template = fs
    .readFileSync(path.join(__dirname, "envless.rb"))
    .toString("utf-8");

  return template;
}

async function updateEnvlessFormula(template) {
  const octokit = new Octokit({
    auth: process.env.TAP_GITHUB_TOKEN,
  });

  console.log("getting repository content...");

  const {
    data: { sha },
  } = await octokit.repos.getContent({
    owner: "envless",
    repo: "homebrew",
    path: "Formula/envless.rb",
    branch: "main",
  });

  console.log("updating formula....");

  await octokit.repos.createOrUpdateFileContents({
    owner: "envless",
    repo: "homebrew",
    path: "Formula/envless.rb",
    message: "Update formula",
    content: Buffer.from(template).toString("base64"),
    sha: sha,
    branch: "main",
  });

  console.log("formula updated successfully...");
}

async function calculateSHA256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("error", (error) => {
      reject(error);
    });

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      const sha256Hash = hash.digest("hex");
      resolve(sha256Hash);
    });
  });
}

async function downloadTarballFromS3(
  stableReleasePathInS3,
  fileName,
  downloadPath,
) {
  const commandStr = `aws s3 cp s3://${stableReleasePathInS3}/${fileName} ${downloadPath}`;

  return execa.command(commandStr);
}

function getS3PublicUrl(fileName) {
  return `https://s3.amazonaws.com/cli.envless.dev/channels/stable/${fileName}`;
}

async function main() {
  const template = await getEnvlessFormulaTemplate();

  const stableReleasePathInS3 = `cli.envless.dev/channels/stable`;

  const intelFileName = "envless-darwin-x64.tar.gz";
  const m1FileName = "envless-darwin-arm64.tar.gz";

  const intelFilePath = path.join(__dirname, intelFileName);
  const m1FilePath = path.join(__dirname, m1FileName);

  await Promise.all([
    downloadTarballFromS3(stableReleasePathInS3, intelFileName, intelFilePath),
    downloadTarballFromS3(stableReleasePathInS3, m1FileName, m1FilePath),
  ]);

  const replacedTemplate = template
    .replace("__M1_DOWNLOAD_URL__", getS3PublicUrl(m1FileName))
    .replace("__INTEL_DOWNLOAD_URL__", getS3PublicUrl(intelFileName))
    .replace("__M1_SHA256__", await calculateSHA256(m1FilePath))
    .replace("__INTEL_SHA256__", await calculateSHA256(intelFilePath));

  await updateEnvlessFormula(replacedTemplate);
}

await main();
