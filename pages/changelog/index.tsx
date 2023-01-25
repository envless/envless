import { GetServerSidePropsContext } from "next";
import { remark } from "remark";
import html from "remark-html";
import { Compatible } from "vfile";
import ChangelogCard from "@/components/changelog/ChangelogCard";
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
    <div className="mx-auto my-24 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 grid grid-cols-4">
        <div className="col-span-1"></div>
        <div className="col-span-3">
          <div className={"font-mono text-5xl font-bold"}>Changelog</div>
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
  );
};

export default Changelog;
