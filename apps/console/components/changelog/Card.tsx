import Image from "next/image";
import Link from "next/link";
import { parse } from "node-html-parser";
import DateTimeAgo from "@/components/DateTimeAgo";

const Card = ({ release, parsedReleaseBody }) => {
  const parser = parse(parsedReleaseBody.toString());
  const descriptionParagraph = parser.querySelector("p")?.textContent;
  const imageSrc = parser.querySelector("img")?.getAttribute("src") as string;
  return (
    <div className={"mb-20 grid grid-cols-4"}>
      <div className="col-span-4 sm:col-span-1">
        <Link href={`/changelog/${release.tag_name}`}>
          <div className={"mb-4 inline-flex lg:block"}>
            <span className="mr-3 inline-flex items-center rounded-md bg-teal-400/25 px-3 py-1 font-mono text-sm font-medium text-teal-400 lg:text-lg">
              {release.tag_name}
            </span>
          </div>

          <div className="inline-flex lg:block">
            <DateTimeAgo
              className={"text-white/50"}
              date={release.created_at}
            />
          </div>
        </Link>
      </div>
      <div className={"col-span-4 sm:col-span-3"}>
        <Link href={`/changelog/${release.tag_name}`}>
          <div className="space-y-8">
            <h2
              className={
                "w-fit  bg-gradient-to-r from-teal-400 to-teal-400 bg-[length:0px_2px] bg-left-bottom bg-no-repeat text-2xl transition-[background-size] duration-500 group-hover:bg-[length:100%_2px] hover:bg-[length:100%_2px]"
              }
            >
              {release.name}
            </h2>
            <div className={"font-light text-white/70"}>
              {descriptionParagraph}
            </div>
            <div>
              <span className={"text-teal-400"}>Read More →</span>
            </div>
            <Image
              className={"rounded-lg"}
              width={500}
              height={500}
              src={imageSrc}
              alt={`envless release ${release.tag_name} image`}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
