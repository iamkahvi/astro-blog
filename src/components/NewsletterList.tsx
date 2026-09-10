import type { CollectionEntry } from "astro:content";
import { useState, useMemo, useEffect } from "preact/hooks";
import type { JSX } from "preact";

import SearchBar from "./searchBar";
import { getDateFormats, getSlugFromPath } from "../lib/utils";
import {
  searchAndSortIssues,
  highlightMatch,
  getSearchFromUrl,
  updateUrlQuery,
} from "../lib/search";

type NewsletterIssue = CollectionEntry<"newsletter">;

interface Props {
  issues: NewsletterIssue[];
}

export default function NewsletterList(props: Props) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = getSearchFromUrl();
    if (q) {
      setSearch(q);
    }
  }, []);

  const handleSearch = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const value = e.currentTarget.value;
    setSearch(value);
    updateUrlQuery(value);
  };

  const filteredIssues = useMemo(
    () => searchAndSortIssues(props.issues, search),
    [props.issues, search],
  );

  return (
    <>
      <SearchBar
        handleSearch={handleSearch}
        placeholderText="search newsletter..."
        searchVal={search}
      />
      <div>
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
                  {highlightMatch(title, search)}
                </a>
                <p className="f6 fw4 roboto c-second">
                  {highlightMatch(description, search)}
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
