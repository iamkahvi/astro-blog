import { Fragment } from "preact";
import { useRef } from "preact/hooks";
import SearchBar from "./SearchBar";
import { filterNewsletterIssues, useSearchHighlights, useUrlSyncedSearch } from "../lib/search";
import { CURR_YEAR_STRING, getDateFormats, getSlugFromPath } from "../lib/utils";

type Entry = {
  id: string;
  collection: "posts" | "newsletter";
  data: {
    title: string;
    date: Date;
    description?: string;
  };
  searchText: string;
};

export default function BlogList({ entries, initialSearch = "" }: { entries: Entry[]; initialSearch?: string }) {
  const { search, handleSearch, clearSearch } = useUrlSyncedSearch(initialSearch);
  const listRef = useRef<HTMLDivElement>(null);
  useSearchHighlights(listRef, search, [entries]);
  const visible = filterNewsletterIssues(entries, search);

  return <><SearchBar handleSearch={handleSearch} handleClear={clearSearch} placeholderText="search writing..." searchVal={search} /><div ref={listRef}>{visible.map((entry, index) => {
    const { title, date, description = "" } = entry.data;
    const { year, displayDate, displayDateSmall } = getDateFormats(date);
    const previousYear = index > 0 ? getDateFormats(visible[index - 1].data.date).year : undefined;
    const showYearHeading = Number(year) < Number(CURR_YEAR_STRING) && year !== previousYear;
    const url = `/${entry.collection}/${getSlugFromPath(entry.id)}`;

    return <Fragment key={url}>
      {showYearHeading && <h2 className="year-heading">{year}</h2>}
      <div className="pv3 flex items-center justify-between">
        <h3 className="mv0 w-two-thirds post-title"><a className="f4 mb2 roboto c-main" href={url}>{title}</a><p className="f6 fw4 roboto c-second">{description}</p></h3>
        <small className="post-date f5 roboto c-second fr tr w-third">{displayDate}</small><small className="post-date-small f5 roboto c-second fr tr w-third">{displayDateSmall}</small>
      </div>
    </Fragment>;
  })}</div></>;
}
