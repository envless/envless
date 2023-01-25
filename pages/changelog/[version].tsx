import Image from "next/image";
import { parse } from "node-html-parser";
import { remark } from "remark";
import html from "remark-html";
import { Compatible } from "vfile";
import DateTimeAgo from "@/components/DateTimeAgo";
import { getReleases } from "@/lib/github";

export const getStaticProps = async (context: { params: { version: any } }) => {
  const { version } = context.params;
  const releases = await getReleases();
  const release = releases.filter((release) => release.tag_name === version)[0];
  const releaseBodyAsHtml = await remark()
    .use(html)
    .process(release.body as Compatible);
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
  const parser = parse(releaseBody);
  const descriptionParagraph = parser.querySelector("p")?.textContent;
  const imageSrc = parser.querySelector("img")?.getAttribute("src") as string;
  const releaseDetailsHeading = parser.querySelector("h2")?.textContent;
  const releaseDetails = parser.querySelectorAll("li");

  return (
    <div className="mx-auto my-24 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 flex justify-between">
        <div>
          <div className={"font-mono text-3xl font-bold"}>{release.name}</div>
          <div className={"mt-4"}>
            <DateTimeAgo
              className={"text-white/50"}
              date={release.created_at}
            />
          </div>
        </div>
        <div>
          <span className="inline-flex items-center rounded-md bg-teal-400/50 px-5 py-1 font-mono text-lg font-medium text-teal-400">
            {release.tag_name}
          </span>
        </div>
      </div>
      <div className={"mb-20"}>
        <div>
          <div className="space-y-8">
            <div className={"font-light text-white/70"}>
              {descriptionParagraph}
            </div>
            <Image
              className={"rounded-lg"}
              width={1200}
              height={800}
              src={imageSrc}
              alt={`envless release ${release.tag_name} image`}
            />
            <h2 className={"font-mono text-4xl font-bold"}>
              {releaseDetailsHeading}
            </h2>
            <ul className={"list-disc space-y-4 font-mono text-white/80"}>
              {releaseDetails.map((item, key) => {
                return <li key={key}>{item.textContent}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogDetails;
