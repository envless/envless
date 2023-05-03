/**
 *
 * Truncate if the given length exceeds and append "..."
 * @param string
 * @param charIndex
 * @returns string
 */
export const truncate = (string: string, charIndex: number) =>
  string.length > charIndex ? `${string.substring(0, charIndex)}...` : string;
