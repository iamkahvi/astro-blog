import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_PATH = join(import.meta.dir, "../../src/data/book-shelf.json");
const HTML_PATH = join(import.meta.dir, "index.html");

async function readData() {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeData(data: any) {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
}

function parseDate(dd_mm_yyyy: string): Date {
  const [d, m, y] = dd_mm_yyyy.split("/");
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
}

function sortBooksDesc(books: any[]) {
  return books.sort(
    (a, b) => parseDate(b.dateFinished).getTime() - parseDate(a.dateFinished).getTime(),
  );
}

const server = Bun.serve({
  port: 4444,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/" && req.method === "GET") {
      const html = await readFile(HTML_PATH, "utf-8");
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (url.pathname === "/api/books" && req.method === "GET") {
      const data = await readData();
      return Response.json(data);
    }

    if (url.pathname === "/api/books" && req.method === "POST") {
      const data = await readData();
      const book = await req.json();
      data.books.push(book);
      sortBooksDesc(data.books);
      await writeData(data);
      return Response.json({ ok: true });
    }

    const bookMatch = url.pathname.match(/^\/api\/books\/(\d+)$/);
    if (bookMatch) {
      const index = parseInt(bookMatch[1]);
      const data = await readData();

      if (index < 0 || index >= data.books.length) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      if (req.method === "PUT") {
        const book = await req.json();
        data.books[index] = book;
        sortBooksDesc(data.books);
        await writeData(data);
        return Response.json({ ok: true });
      }

      if (req.method === "DELETE") {
        data.books.splice(index, 1);
        await writeData(data);
        return Response.json({ ok: true });
      }
    }

    if (url.pathname === "/api/meta" && req.method === "PUT") {
      const data = await readData();
      const { title, introHtml } = await req.json();
      data.title = title;
      data.introHtml = introHtml;
      await writeData(data);
      return Response.json({ ok: true });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Book Shelf CMS running at http://localhost:${server.port}`);
