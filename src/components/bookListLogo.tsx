import React from "react";
import Link from "next/link";

const otherLink = (
  <Link
    href="/book-shelf/"
    className="booklist f2 baskerville tc c-second tm mb4"
  >
    📚 →
  </Link>
);

export default function BookListLogo() {
  return (
    <div className="logo-container">
      <Link
        className="mb4 w-100 book-shelf-logo flex items-center justify-center"
        href="/book-shelf/"
      >
        <p className="b helvetica tc">Book Shelf</p>
      </Link>
    </div>
  );
}
