import { getSession } from "next-auth/react";
import Article from "@/components/blog/Article";
import { getBlocks, getNotionData, getPage } from "@/lib/notion";

export const databaseId = process.env.NOTION_DATABASE_ID as string;

type Props = {
  post: any;
  blocks: any;
};

const BlogArticle: React.FC<Props> = ({ post, blocks }) => {
  return <Article post={post} blocks={blocks} />;
};

export const getStaticPaths = async () => {
  const database = await getNotionData(databaseId);
  return {
    paths: database.map((page) => ({
      params: {
        slug: page.properties.Slug.rich_text[0].plain_text,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async (context: { params: { slug: any } }) => {
  const { slug } = context.params;
  const database = await getNotionData(databaseId);
  const filter = database.filter(
    (blog) => blog.properties.Slug.rich_text[0].plain_text === slug,
  );

  const post = await getPage(filter[0].id);
  const blocks = await getBlocks(filter[0].id);

  const childrenBlocks: { id: any; children: any[] }[] = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      }),
  );

  const blocksWithChildren = blocks.map((block) => {
    if (block.has_children) {
      block[block.type].children = childrenBlocks.find(
        (x) => x.id === block.id,
      )?.children;
    }
    return block;
  });

  return {
    props: {
      post,
      blocks: blocksWithChildren,
    },
    revalidate: 60, // In seconds
  };
};

export default BlogArticle;
