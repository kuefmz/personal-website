export const contentDateSortValue = (date: string) => {
  const normalizedDate = date.length === 7 ? `${date}-01` : date;
  return Date.parse(`${normalizedDate}T00:00:00Z`);
};

export const formatContentDate = (date: string, long = false) => {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day ?? 1));

  return new Intl.DateTimeFormat("en", {
    day: day ? "numeric" : undefined,
    month: long ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
};
