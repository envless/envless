import Airtable from "airtable";

const apiKey = String(process.env.AIRTABLE_API_KEY);
const baseId = String(process.env.AIRTABLE_BASE_ID);
const database = String(process.env.AIRTABLE_DATABASE);
const base = new Airtable({ apiKey }).base(baseId);

/**
 * Creates a new record in an Airtable database with the given ID.
 *
 * @param data The data to create a new record with.
 * @returns The newly created record.
 * @see https://airtable.com/api
 *
 **/

export const createRecord = async (data: any): Promise<any> => {
  const response = await base(database).create(data);
  return response;
};
