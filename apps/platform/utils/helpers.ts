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

export const getInitials = (string: string) => {
  const names = string.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  } else {
    initials += names[0].substring(1, 2).toUpperCase();
  }

  return initials;
};
