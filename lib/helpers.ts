export const stringToUUID = (str: string) => {
  let uuid = "";
  const replace = (str: string, index: number, value: string) => {
    return str.substr(0, index) + value + str.substr(index);
  };

  uuid = replace(uuid, 8, "-");
  uuid = replace(uuid, 13, "-");
  uuid = replace(uuid, 18, "-");
  uuid = replace(uuid, 23, "-");
  return uuid;
};

const HYPHENS_POSITIONS = [8, 12, 16, 20];
const VALUE_REGEXP = /^[0-9A-Fa-f]{32}$/;

/**
 * Insert value to a source array at position
 * @param {Array} source array to insert
 * @param {number} position position to insert
 * @param {*} value value to insert
 * @returns {Array}
 */
function insert<T>(source: T[], position: number, value: T): T[] {
  return [...source.slice(0, position), value, ...source.slice(position)];
}

/**
 * Format string to UUID format
 * @param {string} value string of 32 hexadecimal numbers
 * @returns {string} formatted toUUID string
 */

export const toUUID = (value: string) => {
  if (typeof value !== "string") {
    throw new Error(`Value must be string`);
  }
  if (!VALUE_REGEXP.test(value)) {
    throw new Error(`Value must be string of 32 hexadecimal numbers`);
  }

  let array = value.split("");
  let offset = 0;
  for (const num of HYPHENS_POSITIONS) {
    const position = num + offset++;
    array = insert(array, position, "-");
  }
  return array.join("");
};

export const truncate = (string: string, charIndex: number) =>
  string.length > charIndex ? `${string.substring(0, charIndex)}...` : string;
