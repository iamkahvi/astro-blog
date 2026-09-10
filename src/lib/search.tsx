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

export function getSearchFromParams(params: URLSearchParams): string {
  return params.get("q") ?? params.get("search") ?? "";
}

export function getSearchFromUrl(): string {
  if (typeof window === "undefined") return "";
  return getSearchFromParams(new URLSearchParams(window.location.search));
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

export function useUrlSyncedSearch(initialSearch = "") {
  // Let the post-hydration effect read the URL on static pages. Initializing
  // from getSearchFromUrl() here makes Preact skip updating the hydrated input
  // when the server-rendered value was empty but the URL contains a query.
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const query = getSearchFromUrl();
    setSearch((current) => (current === query ? current : query));
  }, []);

  const handleSearch = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const value = e.currentTarget.value;
    setSearch(value);
    updateUrlQuery(value);
  };

  return { search, handleSearch };
}

function getHighlightPatterns(query: string): string[] | null {
  const clean = query.trim();
  if (!clean) return null;

  const tokens = clean.split(/\s+/).filter(Boolean);
  const patterns = Array.from(new Set([clean, ...tokens])).map(escapeRegExp);
  return patterns.length > 0 ? patterns : null;
}

export function getHighlightRegex(query: string): RegExp | null {
  const patterns = getHighlightPatterns(query);
  return patterns ? new RegExp(`(${patterns.join("|")})`, "gi") : null;
}

interface SearchHighlightRoot {
  current: HTMLElement | null;
}

export function useSearchHighlights(
  containerRef: SearchHighlightRoot,
  query: string,
  dependencies: readonly unknown[] = [],
): void {
  useEffect(() => {
    const { CSS: css, Highlight } = globalThis as typeof globalThis & {
      CSS?: {
        highlights?: {
          set(name: string, highlight: unknown): void;
          delete(name: string): void;
        };
      };
      Highlight?: new (...ranges: Range[]) => unknown;
    };

    const container = containerRef.current;
    if (!css?.highlights || !Highlight || !container) return;

    const highlightName = "search-matches";
    css.highlights.delete(highlightName);

    const regex = getHighlightRegex(query);
    if (!regex) return;

    const ranges: Range[] = [];
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      // Generated year headings are not searchable fields.
      if ((node.parentElement as HTMLElement | null)?.closest("h1, h2")) {
        continue;
      }

      const text = node.textContent ?? "";
      regex.lastIndex = 0;
      for (const match of text.matchAll(regex)) {
        if (match.index === undefined) continue;

        const range = new Range();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        ranges.push(range);
      }
    }

    if (ranges.length > 0) {
      css.highlights.set(highlightName, new Highlight(...ranges));
    }

    return () => css.highlights?.delete(highlightName);
  }, [containerRef, query, ...dependencies]);
}

export function matchesSearch(query: string, ...fields: string[]): boolean {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return true;

  const searchableText = fields.join(" ").toLowerCase();
  return cleanQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => searchableText.includes(token));
}

export interface SearchableIssue {
  data: {
    title: string;
    description?: string;
  };
  body?: string;
}

type SearchFieldGetters<T> = Record<string, (item: T) => string[]> & {
  default: (item: T) => string[];
};

function filterBySearchFields<T>(
  items: T[],
  query: string,
  fields: SearchFieldGetters<T>,
): T[] {
  const termsByField = new Map<string, string[]>();
  const supportedKeywords = new Set(
    Object.keys(fields).filter((field) => field !== "default"),
  );

  for (const term of query.trim().split(/\s+/).filter(Boolean)) {
    const separatorIndex = term.indexOf(":");
    const keyword = term.slice(0, separatorIndex).toLowerCase();
    const isQualified =
      separatorIndex > 0 && supportedKeywords.has(keyword);
    const field = isQualified ? keyword : "default";
    const value = isQualified ? term.slice(separatorIndex + 1) : term;

    if (!value) continue;
    const fieldTerms = termsByField.get(field) ?? [];
    fieldTerms.push(value);
    termsByField.set(field, fieldTerms);
  }

  if (termsByField.size === 0) return items;

  return items.filter((item) =>
    Array.from(termsByField).every(([field, terms]) =>
      matchesSearch(terms.join(" "), ...fields[field](item)),
    ),
  );
}

export function filterNewsletterIssues<T extends SearchableIssue>(
  issues: T[],
  query: string,
): T[] {
  return filterBySearchFields(issues, query, {
    default: (issue) => [
      issue.data.title,
      issue.data.description ?? "",
    ],
    content: (issue) => [stripMarkdown(issue.body ?? "")],
  });
}
