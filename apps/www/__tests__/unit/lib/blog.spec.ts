import { describe, expect, it } from "vitest";
import { getBlogPost, getBlogPosts } from "../../../lib/blog";

describe("getBlogPost", () => {
  it("should return correct slug and content for valid file", async () => {
    const fileName = "1.introducing-envless.mdx";
    const expectedSlug = "introducing-envless";
    const result = await getBlogPost(fileName);

    expect(result.slug).toBe(expectedSlug);
  });

  it("should throw error for invalid file", async () => {
    const fileName = "invalid-file.mdx";
    await expect(getBlogPost(fileName)).rejects.toThrow();
  });
});

describe("getBlogPosts", () => {
  it("should return an array of blog posts", async () => {
    const result = await getBlogPosts();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });
});
