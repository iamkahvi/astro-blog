import type { CollectionEntry } from "astro:content";
import { useMemo, useRef } from "preact/hooks";

import SearchBar from "./SearchBar";
import { getDateFormats, getSlugFromPath } from "../lib/utils";
import {
  filterNewsletterIssues,
  useSearchHighlights,
  useUrlSyncedSearch,
} from "../lib/search";

type NewsletterIssue = Pick<
  CollectionEntry<"newsletter">,
  "id" | "data" | "body"
>;

const coverExtensions: Record<number, string | null> = {
  115770857: "png",
  121695626: "png",
  158964451: "png",
  184230330: "png",
  96719581: null,
};

interface Props {
  issues: NewsletterIssue[];
  initialSearch?: string;
}

export default function NewsletterList(props: Props) {
  const { search, handleSearch, clearSearch } = useUrlSyncedSearch(props.initialSearch);
  const newsletterListRef = useRef<HTMLDivElement>(null);

  useSearchHighlights(newsletterListRef, search, [props.issues]);

  const filteredIssues = useMemo(
    () => filterNewsletterIssues(props.issues, search),
    [props.issues, search],
  );

  return (
    <>
      <SearchBar
        handleSearch={handleSearch}
        handleClear={clearSearch}
        placeholderText="search newsletter..."
        searchVal={search}
      />
      <div className="newsletter-card-grid" ref={newsletterListRef}>
        {filteredIssues.map((issue) => {
          const slug = getSlugFromPath(issue.id);
          const { title, date, description = "", substack_id } = issue.data;
          const url = "/newsletter/" + slug;
          const coverExtension = substack_id
            ? (coverExtensions[substack_id] ?? "jpg")
            : undefined;
          const coverUrl = substack_id && coverExtension
            ? `https://cdn.kahvipatel.com/newsletter-assets/covers/${substack_id}-cover-001.${coverExtension}`
            : undefined;
          const { displayDateSmall } = getDateFormats(date);

          return (
            <article className="newsletter-card" key={url}>
              <a
                className="newsletter-card-link"
                href={url}
              >
                {coverUrl && (
                  <img
                    className="newsletter-card-cover"
                    src={coverUrl}
                    alt={`${title} cover`}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="newsletter-card-body">
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <time dateTime={date.toISOString()}>{displayDateSmall}</time>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </>
  );
}
