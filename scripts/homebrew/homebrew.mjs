#!/usr/bin/env node
import execa from "execa";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tmp = path.join(__dirname, "tmp");
const homebrewDir = path.join(tmp, "homebrew-tap");
const formulaPath = path.join(homebrewDir, "Formula", "envless.rb");

const git = async (args, opts = {}) => {
  await execa("git", ["-C", homebrewDir, ...args], opts);
};

async function cloneHomebrewTapRepo() {
  console.log(
    `cloning https://github.com/envless/homebrew-tap to ${homebrewDir}`,
  );

  await execa("git", [
    "clone",
    "https://github.com/envless/homebrew-tap.git",
    homebrewDir,
  ]);
  console.log(`done cloning envless/homebrew-tap to ${homebrewDir}`);
}

async function getEnvlessFormulaTemplate() {
  const template = fs
    .readFileSync(path.join(__dirname, "envless.rb"))
    .toString("utf-8");
  return template;
}

async function updateEnvlessFormula() {
  console.log("updating local git repository...");
  await git(["add", "Formula"]);
  // await git(["config", "--local", "core.pager", "cat"]);
  await git(["diff", "--cached"], { stdio: "inherit" });
  await git(["commit", "-m", `envless v0.0.4`]);
  await git(["push", "origin", "main"]);
}

async function downloadTarballFromS3() {}

async function main() {
  const template = await getEnvlessFormulaTemplate();
  await cloneHomebrewTapRepo();

  const replacedTemplate = template
    .replace("__DOWNLOAD_URL__", "https://envless.com")
    .replace("__SHA256__", "some__sha256__here");

  fs.writeFileSync(formulaPath, replacedTemplate);

  await updateEnvlessFormula();
}

await main();
