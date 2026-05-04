// book.models.ts
export interface BookPage {
  content: string;
  tokens_count: number;
}

export interface BookDetails {
  file_id: string;
  title: string;
  course: string;
  academic_year: string;
  department: string;
  semester: string;
  total_pages: number;
  total_tokens: number;
  pages: BookPage[];
}
