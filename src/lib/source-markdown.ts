// import { readdir } from "fs/promises";
// import { join, parse } from "path";
// import matter from "gray-matter";
// import { unified } from "unified";
// import remarkParse from "remark-parse";
// import remarkHtml from "remark-html";

// import { getDateFormats } from "./utils";

// const POSTS_PATH = join(process.cwd(), "content/posts");
// const ABOUT_PATH = join(process.cwd(), "content/about/about.md");

// export interface AboutPageData {
//   title: string;
//   html: string;
// }

// export async function getAboutPageData(): Promise<AboutPageData> {
//   const file = Bun.file(ABOUT_PATH);
//   const text = await file.text();

//   const { data, content } = matter(text);
//   const { title } = data;

//   const html = await markdownToHtml(content);

//   return {
//     title,
//     html,
//   };
// }

// export interface BlogPost {
//   title: string;
//   html: string;
//   frontmatter: {
//     year: string;
//     displayDate: string;
//     displayDateSmall: string;
//     description: string;
//   };
// }

// export async function getBlogPost(slug: string): Promise<BlogPost> {
//   const file = Bun.file(join(POSTS_PATH, slug + ".md"));
//   const text = await file.text();

//   const { data, content } = matter(text);
//   const { title, date, description = "" } = data;

//   const html = await markdownToHtml(content);

//   const { year, displayDate, displayDateSmall } = getDateFormats(date);

//   return {
//     title,
//     html,
//     frontmatter: {
//       year,
//       displayDate,
//       displayDateSmall,
//       description,
//     },
//   };
// }

// export interface BlogPostEntry {
//   title: string;
//   year: string;
//   displayDate: string;
//   displayDateSmall: string;
//   description: string;
//   slug: string;
// }

// type BlogPostEntryWithDate = BlogPostEntry & { date: Date };

// export async function getBlogPostEntries(): Promise<BlogPostEntry[]> {
//   const paths = await readdir(POSTS_PATH);

//   const entryPromises = paths.flatMap<Promise<BlogPostEntryWithDate[]>>(
//     async (path: string) => {
//       const file = Bun.file(join(POSTS_PATH, path));
//       const text = await file.text();

//       const frontMatter = matter(text);
//       const {
//         title,
//         date,
//         description = "",
//         layout,
//         published,
//       } = frontMatter.data;

//       if (layout !== "post" || published === false) return [];

//       const { year, displayDate, displayDateSmall } = getDateFormats(date);

//       return [
//         {
//           title,
//           year,
//           date,
//           displayDate,
//           displayDateSmall,
//           description: description,
//           slug: parse(path).name,
//         },
//       ];
//     }
//   );

//   const entries = (await Promise.all(entryPromises))
//     .flat()
//     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//   // Removing the date property
//   return entries.map(({ date, ...rest }) => rest);
// }

// const MD_HIGHLIGHTS_PATH = join(process.cwd(), "content/highlights/markdown");
// const JSON_HIGHLIGHTS_PATH = join(process.cwd(), "content/highlights/json");

// export interface HighlightPostEntry {
//   title: string;
//   slug: string;
// }

// export async function getHighlightEntries(): Promise<HighlightPostEntry[]> {
//   const mdPaths = (await readdir(MD_HIGHLIGHTS_PATH)).map((path) =>
//     join(MD_HIGHLIGHTS_PATH, path)
//   );
//   const jsonPaths = (await readdir(JSON_HIGHLIGHTS_PATH)).map((path) =>
//     join(JSON_HIGHLIGHTS_PATH, path)
//   );

//   const paths = [...mdPaths, ...jsonPaths];

//   const entryPromises = paths.flatMap<Promise<HighlightPostEntry[]>>(
//     async (path: string) => {
//       const ext = path.split(".").pop();
//       const name = path.split("/").pop() || "";
//       const file = Bun.file(path);

//       switch (ext) {
//         case "json": {
//           const json = await file.json();

//           const { book: title = "" } = json[0];

//           return [
//             {
//               title,
//               slug: name,
//             },
//           ];
//         }
//         case "md": {
//           const text = await file.text();

//           const frontMatter = matter(text);
//           const { title } = frontMatter.data;

//           return [
//             {
//               title,
//               slug: name,
//             },
//           ];
//         }
//         default: {
//           return [];
//         }
//       }
//     }
//   );

//   const entries = (await Promise.all(entryPromises)).flat();

//   return entries;
// }

// export interface HighlightPostMarkdown {
//   title: string;
//   displayDate: string;
//   displayDateSmall: string;
//   html: string;
// }

// export async function getMarkdownHighlight(
//   slug: string
// ): Promise<HighlightPostMarkdown> {
//   const file = Bun.file(join(MD_HIGHLIGHTS_PATH, slug));
//   const text = await file.text();

//   const { data, content } = matter(text);
//   const { title, date } = data;

//   const html = await markdownToHtml(content);

//   const { displayDate, displayDateSmall } = getDateFormats(date);

//   return {
//     title,
//     html,
//     displayDate,
//     displayDateSmall,
//   };
// }

// export interface HighlightPostJson {
//   title: string;
//   displayDate: string;
//   displayDateSmall: string;
//   highlights: HighlightJson[];
// }

// export interface HighlightJson {
//   book: string;
//   author: string;
//   quote: string;
//   page: number | null;
//   location: {
//     start: number;
//     end: number;
//   };
//   dateAdded: number;
// }

// export async function getJsonHighlight(
//   slug: string
// ): Promise<HighlightPostJson> {
//   const file = Bun.file(join(JSON_HIGHLIGHTS_PATH, slug));
//   const json = await file.json();

//   const { book: bookTitle, author, dateAdded: epochSeconds } = json[0];
//   const title = `${bookTitle} by ${author}`;

//   const { displayDate, displayDateSmall } = getDateFormats(epochSeconds);

//   return {
//     title,
//     displayDate,
//     displayDateSmall,
//     highlights: json,
//   };
// }

// async function markdownToHtml(markdown: string): Promise<string> {
//   return String(
//     // @ts-ignore
//     await unified().use(remarkParse).use(remarkHtml).process(markdown)
//   );
// }
