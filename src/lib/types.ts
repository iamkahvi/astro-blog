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
