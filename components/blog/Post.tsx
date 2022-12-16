import Link from "next/link";

type Post = {
  id: string;
  properties: {
    "Cover Image": {
      files: [
        {
          type: "file" | "external";
          file?: {
            url: string;
          };
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

type Props = {
  post?: Post;
};

const Post: React.FC<Props> = ({ post }) => {
  if (post === undefined) {
    return <>POST is undefined</>;
  }

  const postImageUrl = () => {
    const postImage = post?.properties["Cover Image"].files[0];
    return postImage?.type === "file"
      ? postImage?.file?.url
      : postImage?.external?.url;
  };

  const postLink = () => {
    return `/blog/${post?.properties.Slug.rich_text[0].plain_text}`;
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
    <div className="group grid cursor-pointer gap-3">
      <div className="relative aspect-video overflow-hidden rounded-md transition-all transition duration-300 ease-in-out group-hover:scale-105">
        <Link href={postLink()}>
          <img
            alt={postTitle()}
            src={postImageUrl()}
            decoding="async"
            className="pb-10"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-3 text-light lg:mt-5">
          <time className="text-sm" dateTime="2022-10-21T10:50:00.000Z">
            {postDate()}
          </time>
        </div>
        <h2 className="mt-2 text-xl font-semibold tracking-normal text-lightest lg:text-2xl">
          <span className=" bg-gradient-to-r from-teal-400 to-teal-400 bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_2px] group-hover:bg-[length:100%_2px]">
            {postTitle()}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default Post;
