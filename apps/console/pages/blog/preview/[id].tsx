import Article from "@/components/blog/Article";
import { toUUID } from "@/lib/helpers";
import { getBlocks, getPage } from "@/lib/notion";

type Props = {
  post: any;
  blocks: any;
};

const Preview: React.FC<Props> = ({ post, blocks }) => {
  return <Article post={post} blocks={blocks} />;
};

export async function getServerSideProps(context: { params: { id: any } }) {
  const { id } = context.params;
  const uuid = toUUID(id);
  const post = await getPage(uuid);
  const blocks = await getBlocks(uuid);

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
    // revalidate: 10, // In seconds
  };
}

export default Preview;

Preview.defaultProps = {
  post: {},
  blocks: {},
};
