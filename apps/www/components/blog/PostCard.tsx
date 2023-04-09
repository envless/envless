import Image from "next/image";
import Link from "next/link";

export type PostCardProps = {
  slug: string;
  content: any;
};

const PostCard: React.FC<PostCardProps> = ({ slug, content }) => {
  return (
    <div className="group grid cursor-pointer gap-3">
      <div className="relative aspect-video overflow-hidden rounded-md transition-all duration-300 ease-in-out group-hover:scale-105">
        <Link href={`/blog/${slug}`}>
          <Image
            alt={content.frontmatter.title}
            src={content.frontmatter.preview}
            width={480}
            height={275}
            decoding="async"
            className="pb-10"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="flex flex-col justify-center">
        <div className="text-light flex items-center space-x-3 lg:mt-5">
          <time className="text-sm" dateTime="2022-10-21T10:50:00.000Z">
            {content.frontmatter.date}
          </time>
        </div>
        <h2 className="text-lightest mt-2 text-lg font-normal tracking-normal lg:text-xl">
          <span className=" bg-gradient-to-r from-teal-400 to-teal-400 bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_2px] group-hover:bg-[length:100%_2px]">
            <Link href={`/blog/${slug}`}>{content.frontmatter.title}</Link>
          </span>
        </h2>
      </div>
    </div>
  );
};

export default PostCard;
