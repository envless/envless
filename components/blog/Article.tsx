import { NextSeo } from "next-seo";
import { getSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import Featured from "@/components/blog/Featured";
import Container from "@/components/theme/Container";
import { RenderBlocks } from "@/components/blog/ContentBlock";
export const databaseId = process.env.NOTION_DATABASE_ID as string;

type Props = {
  loggedIn?: boolean;
  post: any;
  blocks: any;
};

const Article: React.FC<Props> = ({ loggedIn, post, blocks }) => {
  const menu = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Blog",
      href: "/blog",
    },
    {
      name: "Docs",
      href: "/docs",
    },
  ];

  const postImageUrl = () => {
    const postImage = post?.properties["Cover Image"].files[0];
    return postImage?.type === "file"
      ? postImage?.file?.url
      : postImage?.external?.url;
  };

  const postTitle = () => {
    return post?.properties.Post.title[0].plain_text;
  };

  const postDate = () => {
    const date = post.properties.Date.date.start;

    if (date === undefined) {
      return "";
    } else {
      return new Date(post.properties.Date.date.start).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
  };

  return (
    <>
      <NextSeo
        title={`Envless - ${postTitle()}`}
        description="OpenSource, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev",
          description:
            "OpenSource, frictionless and secure way to share and manage app secrets across teams.",
          images: [{ url: postImageUrl() }],
          siteName: "Envless",
        }}
        twitter={{
          handle: "@envless",
          site: "@envless",
          cardType: "summary_large_image",
        }}
      />

      <Container>
        <Navigation loggedIn={loggedIn || false} menu={menu} />
      </Container>

      <Container>
        <section className="md:px-32">
          <Featured
            title={postTitle()}
            date={postDate()}
            image={postImageUrl()}
          />

          <section className="mx-auto my-16 sm:max-w-3xl">
            <RenderBlocks blocks={blocks} />
          </section>
        </section>
      </Container>
    </>
  );
};

export default Article;

Article.defaultProps = {
  loggedIn: false,
};
