import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, "") // Images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links: keep text, drop url
    .replace(/[`#*_~>]/g, "") // Common formatting tokens
    .replace(/<[^>]*>/g, "") // HTML tags
    .replace(/\s+/g, " ")
    .trim();
}

export function getSearchFromUrl(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("q") ?? params.get("search") ?? "";
}

export function updateUrlQuery(query: string): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const trimmed = query.trim();
  if (trimmed) {
    url.searchParams.set("q", query);
    url.searchParams.delete("search");
  } else {
    url.searchParams.delete("q");
    url.searchParams.delete("search");
  }
  const newUrl = url.pathname + url.search + url.hash;
  window.history.replaceState(null, "", newUrl);
}

export function useUrlSyncedSearch() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const query = getSearchFromUrl();
    if (query) {
      setSearch(query);
    }
  }, []);

  const handleSearch = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const value = e.currentTarget.value;
    setSearch(value);
    updateUrlQuery(value);
  };

  return { search, handleSearch };
}

export function highlightMatch(
  text: string,
  query: string,
): (JSX.Element | string)[] | string {
  const clean = query.trim();
  if (!clean || !text) return text;

  const tokens = clean.split(/\s+/).filter(Boolean);
  const patterns = Array.from(new Set([clean, ...tokens])).map(escapeRegExp);
  if (patterns.length === 0) return text;

  const splitPattern = new RegExp(`(${patterns.join("|")})`, "gi");
  const testPattern = new RegExp(`^(?:${patterns.join("|")})$`, "i");

  const parts = text.split(splitPattern);
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    testPattern.test(part) ? (
      <mark key={i} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// Tier 2 Search (Newsletter): Ranked with metadata/body matching
export interface SearchableIssue {
  data: {
    title: string;
    description?: string;
    date: Date | string | number;
  };
  body?: string;
}

export function scoreNewsletterIssue(
  issue: SearchableIssue,
  query: string,
): number {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return 0;

  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;

  const lowerTitle = issue.data.title.toLowerCase();
  const lowerDesc = (issue.data.description || "").toLowerCase();
  const lowerBody = stripMarkdown(issue.body || "").toLowerCase();

  let score = 0;

  // Exact phrase bonuses on rendered text (title and description)
  if (lowerTitle.includes(cleanQuery)) {
    score += lowerTitle.startsWith(cleanQuery) ? 20 : 10;
  }
  if (lowerDesc.includes(cleanQuery)) {
    score += 5;
  }

  // Token matching across fields
  for (const token of tokens) {
    let tokenMatched = false;

    if (lowerTitle.includes(token)) {
      score += 20;
      tokenMatched = true;
    }

    if (lowerDesc.includes(token)) {
      score += 10;
      tokenMatched = true;
    }

    if (lowerBody.includes(token)) {
      score += 1;
      tokenMatched = true;
    }

    if (!tokenMatched) {
      return 0;
    }
  }

  return score;
}

export function searchAndSortIssues<T extends SearchableIssue>(
  issues: T[],
  query: string,
): T[] {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return issues;
  }

  return issues
    .map((issue) => ({
      issue,
      score: scoreNewsletterIssue(issue, cleanQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (
        new Date(b.issue.data.date).valueOf() -
        new Date(a.issue.data.date).valueOf()
      );
    })
    .map(({ issue }) => issue);
}
