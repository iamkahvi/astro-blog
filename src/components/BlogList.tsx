import type { CollectionEntry } from 'astro:content';
import { useRef } from "preact/hooks";

import SearchBar from "./searchBar";
import {
  matchesSearch,
  useSearchHighlights,
  useUrlSyncedSearch,
} from "../lib/search";

import { CURR_YEAR_STRING, getDateFormats, getSlugFromPath } from "../lib/utils";

type BlogPost = CollectionEntry<'posts'>;

interface Props {
  posts: BlogPost[];
  initialSearch?: string;
}

export default function BlogList(props: Props) {
  const { search, handleSearch } = useUrlSyncedSearch(props.initialSearch);
  const blogListRef = useRef<HTMLDivElement>(null);

  useSearchHighlights(blogListRef, search, [props.posts]);

  const renderPost = ({
    current,
    previous,
  }: {
    current: BlogPost;
    previous: BlogPost;
  }) => {
    const { title, date, description = "" } = current.data;
    const url = "/posts/" + getSlugFromPath(current.id);

    const { year, displayDate, displayDateSmall } = getDateFormats(date);
    const { year: prevYear = null } = previous ? getDateFormats(previous.data.date) : {};

    const color = year === CURR_YEAR_STRING ? "c-main" : "c-second";

    return (
      <div key={url}>
        {(prevYear !== year || prevYear === null) && (
          <h1 className={`roboto f5 ${color} tc mb3`}>{year}</h1>
        )}
        <div
          className="pv3 bt b--c-third flex items-center justify-between"
          key={url}
        >
          <h3 className="mv0 w-two-thirds">
            <a
              style={{ boxShadow: `none` }}
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
      </div>
    );
  };

  const filterPosts = (entry: BlogPost) => {
    const { title, date, description = "" } = entry.data;
    const { displayDate, displayDateSmall } = getDateFormats(date);
    return matchesSearch(
      search,
      title,
      displayDate,
      displayDateSmall,
      description,
    );
  };

  return (
    <>
      <SearchBar
        handleSearch={handleSearch}
        placeholderText="search posts..."
        searchVal={search}
      />
      <div ref={blogListRef}>
        {props.posts
          .filter(filterPosts)
          .map((entry, ind, arr) => ({
            current: entry,
            previous: arr[ind - 1] ?? null,
          }))
          .map(renderPost)}
      </div>
    </>
  );
}
