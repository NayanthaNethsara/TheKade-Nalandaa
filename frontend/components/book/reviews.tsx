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
    <Card className="shadow-2xl border-2 border-amber-200/50 dark:border-amber-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <CardHeader className="border-b bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/50 dark:to-orange-950/50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Star className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Reader Reviews
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 px-4 py-2 rounded-xl border border-blue-300/50 dark:border-blue-600/30 shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {average.toFixed(1)}
              </div>
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {total} review{total === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Loading reviews…
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : (
          <div className="space-y-4">
            {/* Ratings Breakdown */}
            {total > 0 && (
              <div className="p-5 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-blue-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                <h3 className="text-sm font-bold mb-4 text-blue-700 dark:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                  Rating Distribution
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count = breakdown[n as 1 | 2 | 3 | 4 | 5] || 0;
                    const pct = total ? Math.round((count / total) * 100) : 0;
                    const colors = {
                      5: "from-emerald-400 to-green-500",
                      4: "from-blue-400 to-cyan-500",
                      3: "from-indigo-400 to-blue-500",
                      2: "from-orange-400 to-amber-500",
                      1: "from-red-400 to-rose-500",
                    };
                    return (
                      <div key={n} className="flex items-center gap-3 text-sm">
                        <span className="w-10 font-bold text-slate-700 dark:text-slate-300">
                          {n}★
                        </span>
                        <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-3 bg-gradient-to-r ${
                              colors[n as keyof typeof colors]
                            } rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-14 text-right tabular-nums font-bold text-slate-700 dark:text-slate-300">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center">
                  <Star className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                </div>
                <p className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">
                  No reviews yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {pageItems.map((r) => (
                    <div
                      key={r.id}
                      className="border rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-lg text-white shadow-md">
                            {r.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {r.userName}
                            </div>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
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
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < r.rating
                                  ? "fill-blue-500 text-blue-500"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {editingId === r.id ? (
                        <div className="space-y-3 mt-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg">
                          <div>
                            <Label
                              htmlFor="editRating"
                              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                            >
                              Edit Rating (1-5)
                            </Label>
                            <Input
                              id="editRating"
                              type="number"
                              min={1}
                              max={5}
                              value={editRating}
                              onChange={(e) =>
                                setEditRating(
                                  parseInt(e.target.value || "5", 10)
                                )
                              }
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="editText"
                              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                            >
                              Edit Review
                            </Label>
                            <Textarea
                              id="editText"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={saveEdit}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
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
                          <div className="text-sm mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
                            {r.reviewText}
                          </div>
                        )
                      )}

                      {currentUserId && r.userId === String(currentUserId) && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(r)}
                            className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteReview(r.id)}
                            disabled={busyDeleteId === r.id}
                            className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
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
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="border-slate-300 dark:border-slate-600"
                    >
                      Previous
                    </Button>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Page {page} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="border-slate-300 dark:border-slate-600"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent uppercase tracking-wide">
              Write Your Review
            </h3>
          </div>
          <form
            onSubmit={submitReview}
            className="space-y-5 p-5 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-xl border border-blue-200/50 dark:border-blue-800/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!currentUserId && (
                <div>
                  <Label
                    htmlFor="name"
                    className="text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-2 border-slate-300 dark:border-slate-600 focus:ring-blue-500/20"
                  />
                </div>
              )}
              <div>
                <Label
                  htmlFor="rating"
                  className="text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Your Rating
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) =>
                      setRating(parseInt(e.target.value || "5", 10))
                    }
                    className="w-20 border-slate-300 dark:border-slate-600 focus:ring-blue-500/20 font-bold text-blue-700 dark:text-blue-300"
                  />
                  <div className="flex gap-1 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 cursor-pointer transition-all hover:scale-110 ${
                          i < rating
                            ? "fill-blue-500 text-blue-500"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                        onClick={() => setRating(i + 1)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label
                htmlFor="text"
                className="text-slate-700 dark:text-slate-300 font-semibold"
              >
                Your Review
              </Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="mt-2 min-h-[120px] border-slate-300 dark:border-slate-600 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Submit Review
              </Button>
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg border border-red-300 dark:border-red-700">
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
