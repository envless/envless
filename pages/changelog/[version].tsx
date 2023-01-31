import Image from "next/image";
import React, { Fragment } from "react";
import { NextSeo } from "next-seo";
import Zoom from "react-medium-image-zoom";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import DateTimeAgo from "@/components/DateTimeAgo";
import Nav from "@/components/static/Nav";
import { Container } from "@/components/theme";
import { getReleases } from "@/lib/github";
import Markdown from "@/components/changelog/Markdown";

export const getStaticProps = async (context: { params: { version: any } }) => {
  const { version } = context.params;
  const releases = await getReleases();
  const release = releases.filter((release) => release.tag_name === version)[0];

  const releaseBodyAsHtml = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(release.body as string);

  return {
    props: {
      version,
      release,
      releaseBody: releaseBodyAsHtml.toString(),
    },

    revalidate: 60, // In seconds
  };
};

export const getStaticPaths = async () => {
  const releases = await getReleases();
  return {
    paths: releases.map((release) => ({
      params: {
        version: release.tag_name,
      },
    })),
    fallback: false,
  };
};

const ChangelogDetails = ({ release, releaseBody }) => {
  const menu = [
    {
      name: "Docs",
      href: "/docs",
    },
    {
      name: "Blog",
      href: "/blog",
    },
  ];

  return (
    <>
      <NextSeo
        title="Changelog - Latest features, fixes and improvements."
        description={"descriptionParagraph"}
        canonical="https://envless.dev/changelog"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev/changelog",
          title: "Changelog - Latest features, fixes and improvements.",
          description: "descriptionParagraph",
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
        <Nav menu={menu} />
      </Container>

      <Container>
        <div className="mx-auto my-24 max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex justify-between">
            <div>
              <h1
                className={
                  "font-display inline bg-gradient-to-r from-teal-100 via-teal-300 to-cyan-500 bg-clip-text text-3xl tracking-tight text-transparent md:text-4xl"
                }
              >
                {release.name}
              </h1>
              <div className={"mt-4"}>
                <DateTimeAgo
                  className={"text-white/50"}
                  date={release.created_at}
                />
              </div>
            </div>
            <div>
              <span className="inline-flex items-center rounded-md bg-teal-400/25 px-5 py-1 font-mono text-lg font-medium text-teal-400">
                {release.tag_name}
              </span>
            </div>
          </div>
          <div className={"mb-20"}>
            <div>
              {/* <div className=" space-y-8">
                <article
                  className={"markdown"}
                  dangerouslySetInnerHTML={{ __html: releaseBody }}
                />
              </div> */}
              <Markdown>{release.body}</Markdown>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ChangelogDetails;
