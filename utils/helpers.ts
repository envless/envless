export const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString("en-us", {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const capitalizeText = (text: string) => {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}
