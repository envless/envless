import { env } from "@/env/index.mjs";
import { Client } from "@notionhq/client";

/**
 * The main Notion client.
 */
const notion = new Client({
  auth: env.NOTION_TOKEN,
});

/**
 * Retrieves data from a Notion database with the given ID.
 *
 * @param databaseId The ID of the Notion database to query.
 * @returns The results of the query, as an array of objects.
 */
export const getNotionData = async (databaseId: string): Promise<any[]> => {
  const response = await notion.databases.query({
    database_id: databaseId,
    // Filter out posts not checked to publish.
    filter: {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    // Sort posts in descending order based on the Date column.
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });
  return response.results;
};

/**
 * Retrieves a Notion page with the given ID.
 *
 * @param pageId The ID of the Notion page to retrieve.
 * @returns The retrieved Notion page.
 */
export const getPage = async (pageId: string): Promise<any> => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

/**
 * Retrieves the child blocks of a Notion block with the given ID.
 *
 * @param blockId The ID of the Notion block whose children to retrieve.
 * @returns The child blocks of the given Notion block, as an array.
 */
export const getBlocks = async (blockId: string): Promise<any[]> => {
  const blocks = [];
  let cursor = undefined;
  while (true) {
    const list: any = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });

    const { results, next_cursor } = list;

    // @ts-ignore
    blocks.push(...results);

    if (!next_cursor) {
      break;
    }

    cursor = next_cursor;
  }
  return blocks;
};
