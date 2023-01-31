import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { remark } from "remark";
import html from "remark-html";
import { Compatible } from "vfile";
import ChangelogCard from "@/components/changelog/ChangelogCard";
import Nav from "@/components/static/Nav";
import { Container } from "@/components/theme";
import { getReleases } from "@/lib/github";

export async function getStaticProps(context: GetServerSidePropsContext) {
  const releases = await getReleases();
  const parsedReleaseBodyContent: string[] = [];

  releases.map(async (release) => {
    const processedContent = await remark()
      .use(html)
      .process(release.body as Compatible);
    const contentHtml = processedContent.toString();
    parsedReleaseBodyContent.push(contentHtml);
  });

  return {
    props: {
      releases,
      parsedReleaseArr: parsedReleaseBodyContent,
    },
  };
}

const Changelog = ({ releases, parsedReleaseArr }) => {
  return (
    <>
      <NextSeo
        title="Changelog - Latest features, fixes and improvements."
        description="OpenSource, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev/changelog"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev/changelog",
          title: "Changelog - Latest features, fixes and improvements.",
          description:
            "OpenSource, frictionless and secure way to share and manage app secrets across teams.",
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
          <div className="mb-12 grid grid-cols-4">
            <div className="col-span-1"></div>
            <div className="col-span-3">
              <h1
                className={
                  "font-display inline bg-gradient-to-r from-teal-100 via-teal-300 to-cyan-500 bg-clip-text text-3xl tracking-tight text-transparent md:text-5xl"
                }
              >
                Changelog
              </h1>
            </div>
          </div>
          <ul>
            {releases.map((release, i) => {
              return (
                <li key={i}>
                  <ChangelogCard
                    release={release}
                    parsedReleaseBody={parsedReleaseArr[i]}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </>
  );
};

export default Changelog;
