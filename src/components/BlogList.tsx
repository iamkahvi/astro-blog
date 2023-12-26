import { useState } from "preact/hooks";
import type { ChangeEvent } from "react";

import SearchBar from "./searchBar";
import BookListLogo from "./bookListLogo";

import { CURR_YEAR_STRING, getSlugFromPath, getDateFormats } from "../lib/utils";

export default function BlogList({ posts }: { posts: any }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore

    console.log(e.target.value);
    setSearch(e.target.value);
    // if (e.target.value.toLowerCase() === "mama") {
    //   navigate("/mothersday", { state: { isAuth: true } });
    // }
  };

  const renderPost = ({
    next,
    current,
    previous,
  }: {
    next: any;
    current: any;
    previous: any;
  }) => {
    const { title, date, description } = current.frontmatter;
    const url = "/posts/" + getSlugFromPath(current.file);

    const { year, displayDate, displayDateSmall } = getDateFormats(date);
    const { year: prevYear = null } = previous ? getDateFormats(previous?.frontmatter?.date) : {};
    const { year: nextYear = null } = next ? getDateFormats(next?.frontmatter?.date) : {};

    const color = year === CURR_YEAR_STRING ? "c-main" : "c-second";

    console.log("title" + title);
    console.log("prevYear " + prevYear);
    console.log("year " + year);
    console.log("nextYear " + nextYear);

    console.log(prevYear !== year || prevYear === null)

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
            <p
              dangerouslySetInnerHTML={{
                __html: description,
              }}
              className="f6 fw4 roboto c-second"
            />
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

  const filterPosts = (entry: any) => {
    const { title, date, description } = entry.frontmatter;

    return (title + date + description)
      .toLowerCase()
      .includes(search.toLowerCase()) || search === ""
  }

  return (
    <>
      <BookListLogo />
      <SearchBar
        handleSearch={handleSearch}
        placeholderText="search posts..."
        searchVal={search}
        isSticky={false}
      />
      {posts
        .filter(filterPosts)
        .map((entry: any, ind: number, arr: any) => ({
          next: arr[ind + 1] ?? null,
          current: entry,
          previous: arr[ind - 1] ?? null,
        }))
        .map(renderPost)}
    </>
  );
}
