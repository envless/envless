import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getStars = async () => {
  const response = await octokit.request("GET /repos/envless/envless/stargazers", {
    owner: 'envless',
    repo: 'envless',
  });

  const { data } = response;
  const stars = Object.keys(data)
  return stars.length;
}
