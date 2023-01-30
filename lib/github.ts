import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

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
  const { data  } = await octokit.request(
    "GET /repos/envless/envless/contributors",
    {
      owner: "envless",
      repo: "envless",
    },
  );

  return data;
}
