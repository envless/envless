import dynamic from "next/dynamic";
import remarkGfm from 'remark-gfm'
import { NextSeo } from "next-seo";
import Hero from "@/components/shared/Hero";
import { getReleases } from "@/lib/github";
import { getSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import Container from "@/components/theme/Container";
export const databaseId = process.env.NOTION_DATABASE_ID as string;

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
});

type Props = {
  loggedIn: boolean;
  releases: Array<PostProps>;
};

type PostProps = {
  id: string;
  properties: {
    "Cover Image": {
      files: [
        {
          type: "file" | "external";
          file?: {
            url: string;
          };z
          external?: {
            url: string;
          };
        },
      ];
    };

    Slug: {
      rich_text: [
        {
          plain_text: string;
        },
      ];
    };

    Post: {
      title: [
        {
          plain_text: string;
        },
      ];
    };

    Date: {
      date: {
        start: string;
      };
    };
  };
};

const Changelog: React.FC<Props> = ({ loggedIn, releases }) => {
  const menu = [
    {
      name: "Docs",
      href: "/docs",
    },
  ];

  return (
    <>
      <NextSeo
        title="Changelog - Latest features, fixes and improvements."
        description="OpenSource, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev/changelog"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev/changelog",
          title:
            "Changelog - Latest features, fixes and improvements.",
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
        <Navigation loggedIn={loggedIn} menu={menu} />
        <Hero title="Changelog" subtitle="Latest features, fixes and improvements." />
      </Container>

      <Container>
        <section className="md:px-32">
          <section className="my-24 grid gap-10 md:grid-cols-2 lg:gap-12 lg:gap-y-16">
            {releases.map((release: any) => (
              <div key={release.id} className="flex flex-col">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 sm:text-3xl">
                    {release.name}
                  </h3>
                  <p className="mt-3 text-lg text-gray-500">
                    <ReactMarkdown children={release.body} remarkPlugins={[remarkGfm]} />
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                      <span className="sr-only">Read more</span>
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 3a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm0 2a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7zm-1 4a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1zm1-3a1 1 0 011 1v1a1 1 0 11-2 0V7a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                  </div>
                  <div className="ml-3">

                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={release.published_at}>
                        {release.published_at}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>
      </Container>
    </>
  );
};

export const getStaticProps = async () => {
  const releases = await getReleases()

  console.log(releases)
  return {
    props: { releases },
    revalidate: 60, // In seconds
  };
};

export default Changelog;
