import { Octokit, App } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getReleases = async () => {
  const releases = await octokit.rest.repos.listReleases({
    owner: "envless",
    repo: "envless",
  })

  return releases.data;
}
