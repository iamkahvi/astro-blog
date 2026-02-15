import { writeFile } from "node:fs/promises";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { INLINES } from "@contentful/rich-text-types";
import { getDateFormats } from "../src/lib/utils";

const attributeValue = (value: string) => `"${value.replace(/"/g, "&quot;")}"`;
const HOSTNAME = "kahvipatel.com";

const BOOK_SHELF_DATA_QUERY = `
{
  bookShelf(id: "${process.env.BOOK_SHELF_ID}") {
    title
    intro { json }
    bookListCollection(order: dateFinished_DESC) {
      items {
        bookTitle
        bookAuthor
        bookDescription { json }
        dateFinished
      }
    }
  }
}
`;

const RENDER_OPTIONS = {
  renderNode: {
    [INLINES.HYPERLINK]: (node: any, next: any) => {
      try {
        const href = typeof node.data.uri === "string" ? node.data.uri : "";
        const url = new URL(href);
        const target = url.hostname === HOSTNAME ? "" : `target="_blank"`;
        return `<a href=${attributeValue(url.href)} ${target}>${next(node.content)}</a>`;
      } catch {
        return `<a href=${node.data.uri}>${next(node.content)}</a>`;
      }
    },
  },
};

async function fetchGraphQL(query: string) {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    },
  );

  if (!response.ok) {
    throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  const { data } = await fetchGraphQL(BOOK_SHELF_DATA_QUERY);

  if (!data?.bookShelf) {
    throw new Error("No bookShelf data returned from Contentful");
  }

  const { title, intro, bookListCollection } = data.bookShelf;

  if (!intro?.json) {
    throw new Error("BookShelf intro content is missing");
  }

  if (!bookListCollection?.items) {
    throw new Error("BookShelf book list is missing");
  }

  const introHtml = documentToHtmlString(intro.json, RENDER_OPTIONS);

  const books = bookListCollection.items.map((bookItem: any) => {
    const { bookTitle, bookAuthor, dateFinished, bookDescription } = bookItem;
    const { year, displayDate } = getDateFormats(dateFinished, "DD/MM/YYYY");

    return {
      title: bookTitle,
      author: bookAuthor,
      dateFinished: displayDate,
      descriptionHtml: bookDescription?.json
        ? documentToHtmlString(bookDescription.json, RENDER_OPTIONS)
        : "",
      year,
    };
  });

  const output = { title, introHtml, books };

  await writeFile("src/data/book-shelf.json", JSON.stringify(output, null, 2));
  console.log("Wrote src/data/book-shelf.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
