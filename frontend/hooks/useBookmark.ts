"use client";

import { useState, useEffect } from "react";
import { readIdFromJwt } from "@/lib/auth";

interface BookmarkResponse {
    bookId: number;
}

export interface UseBookmarkReturn {
    bookmarks: number[];
    fetchBookmarks: (token: string | null) => Promise<void>;
    toggle: (bookId: number, token: string | null) => Promise<boolean>;
}

export function useBookmark(): UseBookmarkReturn {
    const [bookmarks, setBookmarks] = useState<number[]>([]);

    async function fetchBookmarks(token: string | null): Promise<void> {
        if (!token) return;
        try {
            const res = await fetch(`/api/bookmarks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) return;
            const data = await res.json();
            setBookmarks(data.map((b: BookmarkResponse) => b.bookId));
        } catch (e) {
            console.error(e);
        }
    }

    async function toggle(bookId: number, token: string | null) {
        if (!token) return false;
        const exists = bookmarks.includes(bookId);
        try {
            if (exists) {
                const res = await fetch(`/api/bookmark/${bookId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    setBookmarks((prevBookmarks: number[]) => prevBookmarks.filter((id: number) => id !== bookId));
                    return true;
                }
            } else {
                const res = await fetch(`/api/bookmark`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ bookId }),
                });
                if (res.ok) {
                    setBookmarks((prevBookmarks: number[]) => [...prevBookmarks, bookId]);
                    return true;
                }
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    }

    return { bookmarks, fetchBookmarks, toggle };
}
