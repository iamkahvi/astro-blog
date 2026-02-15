import data from "../data/book-shelf.json";
import type { BookShelfData } from "./types";

export async function getBookShelfData(): Promise<BookShelfData> {
  return data as BookShelfData;
}
