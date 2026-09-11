import type { CollectionEntry } from "astro:content";
import { useMemo, useRef } from "preact/hooks";

import SearchBar from "./SearchBar";
import { getDateFormats, getSlugFromPath } from "../lib/utils";
import {
  filterNewsletterIssues,
  useSearchHighlights,
  useUrlSyncedSearch,
} from "../lib/search";

type NewsletterIssue = CollectionEntry<"newsletter">;

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
      <div ref={newsletterListRef}>
        {filteredIssues.map((issue, i) => {
          const slug = getSlugFromPath(issue.id);
          const url = "/newsletter/" + slug;
          const { title, date, description = "" } = issue.data;
          const { displayDate, displayDateSmall } = getDateFormats(date);

          return (
            <div
              className={
                "pv3 flex items-center justify-between" +
                (i > 0 ? " bt b--c-third" : "")
              }
              key={url}
            >
              <h3 className="mv0 w-two-thirds">
                <a
                  style={{ boxShadow: "none" }}
                  className="f4 mb2 roboto c-main"
                  href={url}
                >
                  {title}
                </a>
                <p className="f6 fw4 roboto c-second">
                  {description}
                </p>
              </h3>
              <small className="post-date f5 roboto c-second fr tr w-third">
                {displayDate}
              </small>
              <small className="post-date-small f5 roboto c-second fr tr w-third">
                {displayDateSmall}
              </small>
            </div>
          );
        })}
      </div>
    </>
  );
}
