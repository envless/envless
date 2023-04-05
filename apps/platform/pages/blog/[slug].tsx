import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { NextSeo } from "next-seo";
import Zoom from "react-medium-image-zoom";
import Nav from "@/components/static/Nav";
import Container from "@/components/theme/Container";
import { getBlogPosts } from "@/lib/static/blog";

type ArticleProps = {
  post: {
    slug: string;
    content: any;
  };
};

const Article: React.FC<ArticleProps> = ({ post }) => {
  const { slug, content } = post;
  const { frontmatter } = content;
  return (
    <>
      <NextSeo
        title={`Envless - ${frontmatter.title}`}
        description="Open source, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev",
          description:
            "Open source, frictionless and secure way to share and manage app secrets across teams.",
          images: [{ url: frontmatter.preview }],
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
      </Container>

      <Container>
        <section className="md:px-32">
          <section className="mx-auto my-16 sm:max-w-3xl">
            <div className="text-light my-2 flex justify-center text-sm">
              <div>
                <Image
                  src={frontmatter.avatar}
                  alt={frontmatter.author}
                  width={40}
                  height={40}
                  quality={100}
                  className="rounded-full"
                />
              </div>

              <div className="ml-4">
                <p>{frontmatter.author}</p>
                <p>{frontmatter.date}</p>
              </div>
            </div>
            <h1 className="mt-5 text-center text-5xl">{frontmatter.title}</h1>
          </section>
        </section>
      </Container>
    </>
  );
};

export const getStaticPaths = async () => {
  const posts = await getBlogPosts();

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async (context: { params: { slug: string } }) => {
  const { slug } = context.params;
  const posts = await getBlogPosts();
  const post = posts.find((post) => post.slug === slug);

  return {
    props: {
      post,
    },
    revalidate: 60, // In seconds
  };
};

export default Article;
