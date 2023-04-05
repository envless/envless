import { Octokit } from "octokit";

const octokit = new Octokit();

export const getStars = async () => {
  const { data } = await octokit.request(
    "GET /repos/envless/envless/stargazers",
    {
      owner: "envless",
      repo: "envless",
    },
  );

  return Object.keys(data).length;
};

export const getContributors = async () => {
  const { data } = await octokit.request(
    "GET /repos/envless/envless/contributors",
    {
      owner: "envless",
      repo: "envless",
    },
  );

  return data;
};

export const getReleases = async () => {
  const releases = await octokit.rest.repos.listReleases({
    owner: "envless",
    repo: "envless",
  });

  return releases.data;
};
