export interface BookReview {
  id: number;
  bookId: number;
  userId: string;
  userName: string;
  rating: number; // 1-5
  reviewText?: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface BookReviewCreate {
  bookId: number;
  userId: string;
  userName: string;
  rating: number; // 1-5
  reviewText?: string;
}

export interface BookReviewUpdate {
  rating: number;
  reviewText?: string;
}

export interface BookReviewStats {
  bookId: number;
  averageRating: number;
  totalReviews: number;
}
