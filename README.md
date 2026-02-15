# kahvi's blog
Rebuild of my [Gatsby blog](https://github.com/iamkahvi/gatsby-blog) with Astro.

## Install and Usage
1.  **Install packages.**

    ```sh
    yarn
    ```
2.  **Start developing.**

    ```sh
    yarn run dev
    ```

## Book shelf data (local JSON)
The book shelf page reads from `src/data/book-shelf.json`. That file is generated from Contentful and committed to source control.

To refresh the data:
1. Create a `.env` with:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `BOOK_SHELF_ID`
2. Run the export:

   ```sh
   set -a
   source .env
   set +a
   bun run export:books
   ```

This rewrites `src/data/book-shelf.json` with the latest Contentful content.

## Book shelf CMS (local editor)
A lightweight local web UI for editing `src/data/book-shelf.json` directly. Add, edit, and delete books without touching the JSON by hand.

```sh
bun run cms
```

Then open http://localhost:4444. Changes are written to `src/data/book-shelf.json` on save.

Features:
- Add, edit, and delete books
- Rich text editor for book descriptions (bold, italic, blockquote, links)
- Book lookup via [Open Library](https://openlibrary.org/) — type in the search field to find a book and auto-populate title and author
- Page metadata editing (title and intro HTML)
- Dark mode support

## Built With
* [Astro](https://docs.astro.build/en/getting-started/)
* [Tachyons](https://tachyons.io/)
* [Contentful](https://www.contentful.com/) (export only)
