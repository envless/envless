import Image from "next/image";
import Link from "next/link";
import { parse } from "node-html-parser";
import DateTimeAgo from "@/components/DateTimeAgo";

const ChangelogCard = ({ release, parsedReleaseBody }) => {
  const parser = parse(parsedReleaseBody.toString());
  const descriptionParagraph = parser.querySelector("p")?.textContent;
  const imageSrc = parser.querySelector("img")?.getAttribute("src") as string;
  return (
    <div className={"mb-20 grid grid-cols-4"}>
      <div className="col-span-1">
        <div>
          <div className={"mb-4"}>
            <span className="inline-flex items-center rounded-md bg-teal-400/50 px-5 py-1 font-mono text-lg font-medium text-teal-400">
              {release.tag_name}
            </span>
          </div>
          <div>
            <DateTimeAgo
              className={"text-white/50"}
              date={release.created_at}
            />
          </div>
        </div>
      </div>
      <div className={"col-span-3"}>
        <div className="space-y-8">
          <div className={"text-2xl font-bold"}>{release.name}</div>
          <div className={"font-light text-white/70"}>
            {descriptionParagraph}
          </div>
          <div>
            <Link
              className={"text-teal-400"}
              href={`/changelog/${release.tag_name}`}
            >
              Read More →
            </Link>
          </div>
          <Image
            className={"rounded-lg"}
            width={500}
            height={500}
            src={imageSrc}
            alt={`envless release ${release.tag_name} image`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangelogCard;
