import React from "react";

const otherLink = (
  <a
    href="/book-shelf/"
    className="booklist f2 baskerville tc c-second tm mb4"
  >
    📚 →
  </a>
);

export default function BookListLogo() {
  return (
    <div className="logo-container">
      <a
        className="mb3 w-100 book-shelf-logo flex items-center justify-center"
        href="/book-shelf/"
      >
        <p className="b helvetica tc">Book Shelf</p>
      </a>
    </div>
  );
}
