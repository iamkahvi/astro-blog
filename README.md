# kahvi's blog
Rebuild of my [Gatsby blog](https://github.com/iamkahvi/gatsby-blog) with Astro.

## Install and Usage
1.  **Install packages.**

    ```sh
    bun install
    ```
2.  **Start developing.**

    ```sh
    bun run dev
    ```

## Book shelf data
The book shelf page reads from `src/data/book-shelf.json`, which is the source of truth and committed to source control.

To edit book shelf data, use the local CMS:

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
