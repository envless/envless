import { NextSeo } from "next-seo";
import DateTimeAgo from "@/components/DateTimeAgo";
import Markdown from "@/components/changelog/Markdown";
import Nav from "@/components/static/Nav";
import { Container } from "@/components/theme";
import { getReleases } from "@/lib/github";

export const getStaticProps = async (context: { params: { version: any } }) => {
  const { version } = context.params;
  const releases = await getReleases();
  const release = releases.filter((release) => release.tag_name === version)[0];

  return {
    props: {
      version,
      release,
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

const ChangelogDetails = ({ release }) => {
  const description = release.body.split("\r\n")[0] as string;

  return (
    <>
      <NextSeo
        title={`Changelog #${release.tag_name} - ${release.name}`}
        description={description}
        canonical={`https://envless.dev/changelog/${release.tag_name}`}
        themeColor="#111"
        openGraph={{
          url: `https://envless.dev/changelog/${release.tag_name}`,
          title: `Changelog #${release.tag_name} - ${release.name}`,
          description: description,
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
              <Markdown>{release.body}</Markdown>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ChangelogDetails;
