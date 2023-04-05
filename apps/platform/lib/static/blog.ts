import * as fs from "fs/promises";
import { sortBy } from "lodash";
import { serialize } from "next-mdx-remote/serialize";

const getSlugFromFileName = async (fileName: string) => {
  const slug = fileName.replace(/^\d+\./, "").replace(/\.mdx$/, "");
  return slug;
};

export const getBlogPost = async (fileName: string) => {
  const slug = await getSlugFromFileName(fileName);
  const filePath = `./blog/posts/${fileName}`;
  const mdx = await fs.readFile(filePath, { encoding: "utf8" });
  const content = await serialize(mdx, { parseFrontmatter: true });

  return { slug, content };
};

export const getBlogPosts = async () => {
  const files = await fs.readdir("./blog/posts");
  const mdxFiles = files.filter((fileName) => fileName.endsWith(".mdx"));
  const sorted = sortBy(mdxFiles).reverse();
  const parsedFiles = await sorted.map(async (fileName) => {
    return await getBlogPost(fileName);
  });

  return Promise.all(parsedFiles);
};
