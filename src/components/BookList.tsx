import { useEffect, useRef } from "preact/hooks";

import SearchBar from './searchBar'
import { getHighlightRegex, useUrlSyncedSearch } from "../lib/search";
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

    if (!css?.highlights || !Highlight || !bookListRef.current) return;

    const highlightName = "search-matches";
    css.highlights.delete(highlightName);

    const regex = getHighlightRegex(search);
    if (!regex) return;

    const ranges: Range[] = [];
    const walker = document.createTreeWalker(
      bookListRef.current,
      NodeFilter.SHOW_TEXT,
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      // Year headings are not searchable book fields.
      if ((node.parentElement as HTMLElement | null)?.closest("h2")) continue;

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
  }, [books, search]);

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
