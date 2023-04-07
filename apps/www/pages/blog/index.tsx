import { Fragment } from "react";
import { NextSeo } from "next-seo";
import Hero from "@/components/blog/Hero";
import PostCard, { type PostCardProps } from "@/components/blog/PostCard";
import Nav from "@/components/static/Nav";
import Container from "@/components/theme/Container";
import { getBlogPosts } from "@/lib/blog";

type Props = {
  posts: PostCardProps[];
};

const Blog: React.FC<Props> = ({ posts }) => {
  return (
    <>
      <NextSeo
        title="Envless Blog - Tutorials and articles about Envless, security, and more."
        description="Open source, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev/blog"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev/blog",
          title:
            "Envless Blog - Tutorials and articles about Envless, security, and more.",
          description:
            "Open source, frictionless and secure way to share and manage app secrets across teams.",
          images: [{ url: "https://envless.dev/og.png" }],
          siteName: "Envless",
        }}
        twitter={{
          handle: "@envless",
          site: "@envless",
          cardType: "summary_large_image",
        }}
      />

      <Container>
        <Nav />
        <Hero />
      </Container>

      <Container>
        <section className="md:px-32">
          <section className="my-24 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 lg:gap-y-16">
            {posts.map((post) => (
              <div key={post.slug}>
                <PostCard slug={post.slug} content={post.content} />
              </div>
            ))}
          </section>
        </section>
      </Container>
    </>
  );
};

export const getStaticProps = async () => {
  // const post = await getBlogPost("debug-code-github-step-by-step-guide");
  const posts = await getBlogPosts();

  return {
    props: { posts },
  };
};

export default Blog;
