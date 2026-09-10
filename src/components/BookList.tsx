import { useEffect, useRef } from "preact/hooks";

import SearchBar from './searchBar'
import { useSearchHighlights, useUrlSyncedSearch } from "../lib/search";
import { yearMap } from "../lib/utils";
import type { BookShelfData, BookNode } from "../lib/types";

// Books before 2019 don't have reliable finish dates
const EARLIEST_YEAR_WITH_FINISH_DATE = 2019;

interface Props {
  bookShelf: BookShelfData;
}

export default function BookList(props: Props) {
  const { search, handleSearch } = useUrlSyncedSearch();
  const { books, introHtml } = props.bookShelf;
  const bookListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, []);

  useSearchHighlights(bookListRef, search, [books]);

  const renderBook = ({
    current,
    previous,
  }: {
    current: BookNode;
    previous: BookNode | null;
  }) => {
    const { author, title, descriptionHtml, year, dateFinished } = current;
    const prevYear = previous?.year ?? null;

    const idLink = title
      .replace(/[!'’.()*:]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    return (
      <div key={idLink}>
        {prevYear !== year && <h2 className="f4 underline">{yearMap(year)}</h2>}
        <li id={idLink} className="book mb4">
          <div className="mb2">
            <a
              className="book anchor c-second b"
              href={`#${idLink}`}
            >
              <span className="fw5">{title}</span>
            </a>
            by {author}
            {parseInt(year) >= EARLIEST_YEAR_WITH_FINISH_DATE && (
              <em> - {dateFinished} </em>
            )}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />
        </li>
      </div>
    );
  };

  const filterBooks = (book: BookNode) => {
    const clean = search.trim().toLowerCase();
    if (!clean) return true;
    const tokens = clean.split(/\s+/).filter(Boolean);
    const { title, author, dateFinished, descriptionHtml = "" } = book;
    const descText = descriptionHtml.replace(/<[^>]*>/g, " ");
    const renderedText = `${title} ${author} ${dateFinished} ${descText}`.toLowerCase();
    return tokens.every((token) => renderedText.includes(token));
  };

  return (
    <div className="textBody">
      <div
        dangerouslySetInnerHTML={{
          __html: introHtml,
        }}
      />
      <SearchBar
        handleSearch={handleSearch}
        placeholderText="search books..."
        searchVal={search}
      />
      <ul ref={bookListRef} className="ml0">
        {books
          .filter(filterBooks)
          .map((book, ind, arr) => ({
            current: book,
            previous: arr[ind - 1] ?? null,
          }))
          .map(renderBook)}
      </ul>
    </div>
  );
}
