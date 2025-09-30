export interface Book {
  id?: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  titleSlug: string;
  coverImagePath: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookWithChunk extends Book {
  chunkPath: string;
}

export interface BookChunk {
  chunkNumber: number;
  url: string;
  bookId: number;
}

export interface BookFormData {
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  titleSlug: string;
  pdfFile?: File;
  coverImage?: File;
}

export interface BookChunk {
  chunkNumber: number;
  url: string;
  bookId: number;
}
