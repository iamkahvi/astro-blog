import { useState } from "preact/hooks";
import type { JSX } from 'preact'

import SearchBar from './SearchBar'
import { yearMap } from "../lib/utils";
import type { BookShelfData, BookNode } from "../lib/source-contentful";

// Books before 2019 don't have reliable finish dates
const EARLIEST_YEAR_WITH_FINISH_DATE = 2019;

interface Props {
  bookShelf: BookShelfData;
}

export default function BookList(props: Props) {
  const [search, setSearch] = useState("");
  const { books, introHtml } = props.bookShelf;

  const handleSearch = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setSearch(e.currentTarget.value);
  };

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
              href={`/book-shelf#${idLink}`}
            >
              <span className="fw5">{title}</span>
            </a>
            by {author}
            {parseInt(year) >= EARLIEST_YEAR_WITH_FINISH_DATE && <em> - {dateFinished} </em>}
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
    const { title, author, dateFinished } = book;

    return `${title} by ${author} - ${dateFinished}`
      .toLowerCase()
      .includes(search.toLowerCase()) || search === ""
  }

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
        isSticky={false}
      />
      <ul className="ml0">
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
