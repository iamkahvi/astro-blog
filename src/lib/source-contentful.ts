import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { Options } from "@contentful/rich-text-html-renderer";
import { INLINES } from "@contentful/rich-text-types";
import { getDateFormats } from "./utils";

const attributeValue = (value: string) => `"${value.replace(/"/g, "&quot;")}"`;
const HOSTNAME = "kahvipatel.com";

export type BookShelf = {
  title: string;
  intro: {
    json: any;
  };
  bookListCollection: {
    items: BookListItem[];
  };
};

export type BookListItem = {
  bookTitle: string;
  bookAuthor: string;
  dateFinished: string;
  bookDescription: {
    json: any;
  };
};

const BOOK_SHELF_DATA_QUERY = `
{
  bookShelf(id: "${import.meta.env.BOOK_SHELF_ID}") {
    title
    intro {
      json
    }
    bookListCollection(order: dateFinished_DESC) {
      items {
        bookTitle
        bookAuthor
        bookDescription {
          json
        }
        dateFinished
      }
    }
  }
}
`;

const RENDER_OPTIONS: Options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, next) => {
      const href = typeof node.data.uri === "string" ? node.data.uri : "";
      const url = new URL(href);

      if (url.hostname === HOSTNAME) {
        return `<a href=${attributeValue(url.href)}>${next(node.content)}</a>`;
      }
      return `<a href=${attributeValue(url.href)} target="_blank">${
        next(
          node.content,
        )
      }</a>`;
    },
  },
};

type QueryResponse = {
  data: {
    bookShelf: BookShelf;
  };
};

export async function fetchGraphQL(
  query: string,
  preview = false,
): Promise<QueryResponse> {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${import.meta.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? import.meta.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : import.meta.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
      // @ts-ignore
      next: { tags: ["posts"] },
    },
  );

  return await response.json();
}

export interface BookShelfData {
  title: string;
  introHtml: string;
  books: BookNode[];
}

export interface BookNode {
  title: string;
  author: string;
  descriptionHtml: string;
  dateFinished: string;
  year: string;
}

export async function getBookShelfData(): Promise<BookShelfData> {
  const { data } = await fetchGraphQL(BOOK_SHELF_DATA_QUERY);

  const { title, intro, bookListCollection } = data.bookShelf!;
  const introHtml = documentToHtmlString(intro!.json, RENDER_OPTIONS);

  const books = (bookListCollection!.items as BookListItem[]).map(
    (bookItem) => {
      const {
        bookTitle: title,
        bookAuthor: author,
        dateFinished,
        bookDescription,
      } = bookItem;

      const { year, displayDate } = getDateFormats(dateFinished, "DD/MM/YYYY");
      const descriptionHtml = documentToHtmlString(
        bookDescription!.json,
        RENDER_OPTIONS,
      );

      return {
        title,
        author,
        dateFinished: displayDate,
        descriptionHtml,
        year,
      } as BookNode;
    },
  );

  return {
    title: title!,
    introHtml,
    books,
  };
}
