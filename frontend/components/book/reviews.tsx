"use client";
import React, { useEffect, useMemo, useState } from "react";
import { BookReview, BookReviewCreate, BookReviewStats } from "@/types/review";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

interface ReviewsProps {
  bookId: number;
}

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < value
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ))}
  </div>
);

export default function Reviews({ bookId }: ReviewsProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.sub ? String(session.user.sub) : null;
  const currentUserName = session?.user?.name || null;

  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [stats, setStats] = useState<BookReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyDeleteId, setBusyDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editText, setEditText] = useState<string>("");

  // Simple local form state (public endpoints in current backend build)
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");

  const average = useMemo(() => stats?.averageRating ?? 0, [stats]);
  const total = useMemo(() => stats?.totalReviews ?? 0, [stats]);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));
  const pageItems = useMemo(
    () => reviews.slice((page - 1) * pageSize, page * pageSize),
    [reviews, page]
  );

  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<
      1 | 2 | 3 | 4 | 5,
      number
    >;
    for (const r of reviews)
      counts[r.rating as 1 | 2 | 3 | 4 | 5] =
        (counts[r.rating as 1 | 2 | 3 | 4 | 5] || 0) + 1;
    return counts;
  }, [reviews]);

  async function fetchAll() {
    try {
      setLoading(true);
      const [listRes, statsRes] = await Promise.all([
        fetch(`/api/reviews/book/${bookId}`),
        fetch(`/api/reviews/book/${bookId}/stats`),
      ]);

      if (!listRes.ok) throw new Error("Failed to load reviews");
      const list = (await listRes.json()) as BookReview[];
      setReviews(list);

      if (statsRes.ok) setStats((await statsRes.json()) as BookReviewStats);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const isAuthed = Boolean(currentUserId && currentUserName);
    if (!isAuthed && !name.trim()) {
      setError("Please enter your name");
      return;
    }

    const payload: BookReviewCreate = {
      bookId,
      userId: isAuthed
        ? String(currentUserId)
        : name.trim().toLowerCase().replace(/\s+/g, "-") + "-guest",
      userName: isAuthed ? (currentUserName as string) : name.trim(),
      rating,
      reviewText: text.trim() || undefined,
    };

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg =
        (await res.json().catch(() => ({})))?.message ||
        "Failed to submit review";
      setError(msg);
      return;
    }

    setName("");
    setRating(5);
    setText("");
    await fetchAll();
  }

  async function deleteReview(id: number) {
    // Optimistic delete with rollback
    setBusyDeleteId(id);
    const prev = reviews;
    setReviews((cur) => cur.filter((r) => r.id !== id));
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (res.status !== 204) throw new Error("Delete failed");
      await fetchAll();
    } catch (err) {
      setReviews(prev); // rollback
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyDeleteId(null);
    }
  }

  function startEdit(r: BookReview) {
    setEditingId(r.id);
    setEditRating(r.rating);
    setEditText(r.reviewText || "");
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch(`/api/reviews`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        rating: editRating,
        reviewText: editText || undefined,
      }),
    });
    if (!res.ok) {
      setError("Failed to update review");
      return;
    }
    setEditingId(null);
    await fetchAll();
  }

  return (
    <Card className="shadow-xl border-2">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span>Reader Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {average.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {total} review{total === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading reviews…</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <div className="space-y-4">
            {/* Ratings Breakdown */}
            {total > 0 && (
              <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg border">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  Rating Distribution
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count = breakdown[n as 1 | 2 | 3 | 4 | 5] || 0;
                    const pct = total ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={n} className="flex items-center gap-3 text-sm">
                        <span className="w-8 font-medium">{n}★</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-12 text-right tabular-nums font-medium text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No reviews yet</p>
                <p className="text-xs">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {pageItems.map((r) => (
                    <div
                      key={r.id}
                      className="border-2 rounded-lg p-4 hover:border-primary/50 transition-colors bg-card"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-semibold text-sm">
                            {r.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">{r.userName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <Stars value={r.rating} />
                      </div>

                      {editingId === r.id ? (
                        <div className="space-y-2 mt-3">
                          <Label htmlFor="editRating">Edit Rating (1-5)</Label>
                          <Input
                            id="editRating"
                            type="number"
                            min={1}
                            max={5}
                            value={editRating}
                            onChange={(e) =>
                              setEditRating(parseInt(e.target.value || "5", 10))
                            }
                          />
                          <Label htmlFor="editText">Edit Review</Label>
                          <Textarea
                            id="editText"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveEdit}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        r.reviewText && (
                          <div className="text-sm mt-3 leading-relaxed text-muted-foreground">
                            {r.reviewText}
                          </div>
                        )
                      )}

                      {currentUserId && r.userId === String(currentUserId) && (
                        <div className="mt-3 pt-3 border-t flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(r)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteReview(r.id)}
                            disabled={busyDeleteId === r.id}
                          >
                            {busyDeleteId === r.id ? "Deleting…" : "Delete"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {reviews.length > pageSize && (
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <div className="text-xs text-muted-foreground font-medium">
                      Page {page} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
            Write a Review
          </h3>
          <form onSubmit={submitReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!currentUserId && (
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="rating">Your Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) =>
                      setRating(parseInt(e.target.value || "5", 10))
                    }
                    className="w-20"
                  />
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setRating(i + 1)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="text">Your Review</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" className="px-6">
                Submit Review
              </Button>
              {error && (
                <div className="text-sm text-destructive font-medium">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
