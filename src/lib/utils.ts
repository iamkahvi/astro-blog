export const getSlugFromPath = (path: string): string => {
  return path.split("/").at(-1)!.replace(".md", "");
};

export const getSlugFromBookTitle = (path: string): string => {
  return path.replace(/\s+/g, "_").replace(/[\/\\:*?"<>|]+/g, "").toLowerCase();
};

function parseDate(date: string | number | Date): Date {
  if (date instanceof Date) return date;
  if (typeof date === "number") return new Date(date * 1000);
  return new Date(date);
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function getDateFormats(
  date: string | number | Date,
  formatOverride?: string,
): {
  year: string;
  displayDate: string;
  displayDateSmall: string;
} {
  const d = parseDate(date);
  const year = d.getUTCFullYear().toString();

  let displayDate: string;
  if (formatOverride === "DD/MM/YYYY") {
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    displayDate = `${dd}/${mm}/${d.getUTCFullYear()}`;
  } else {
    displayDate = d
      .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
      .replace(/(\d+),/, (_, n) => ordinal(parseInt(n)) + ",");
  }

  const displayDateSmall = d
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .replace(",", "");

  return { year, displayDate, displayDateSmall };
}

export const CURR_YEAR_STRING = new Date().getFullYear().toString();

// 2016/2017 books have uncertain finish dates
export const yearMap = (year: string): string => {
  switch (year) {
    case CURR_YEAR_STRING:
      return "this year";
    case "2017":
      return "possibly in 2017";
    case "2016":
      return "possibly in 2016";
    default:
      return year;
  }
};
