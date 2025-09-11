"use client";

import { UserProfileCard } from "@/components/ui/user-profile-card";
import { BookOpen, Flame, BarChart3 } from "lucide-react";

type SubStatus = "active" | "past_due" | "canceled" | "trialing";

export default function UserProfileDashboard() {
  // Example data
  const user = {
    name: "User Name",
    username: "@example_user",
    joinedAt: "2024-10-02",
  };

  const subscription: {
    tier: string;
    status: SubStatus;
    renewsOn: string;
    paymentMethodLast4: string;
  } = {
    tier: "Premium",
    status: "active",
    renewsOn: "2025-10-01",
    paymentMethodLast4: "4242",
  };

  const stats = {
    minutesRead: 12480,
    booksCompleted: 27,
    currentStreak: 12,
    avgMinutesPerDay: 42,
  };

  const recent = [
    { id: "1", title: "Example_Book_1", author: "Author_1", progress: 78, lastOpened: "2h ago" },
    { id: "2", title: "Example_Book_2", author: "Author_2", progress: 35, lastOpened: "yesterday" },
    { id: "3", title: "Example_Book_3", author: "Author_3", progress: 12, lastOpened: "3d ago" },
  ];

  const genres = ["Sci-Fi", "Self-Help", "Productivity", "Software", "Psychology"];

  const subAccent = getSubAccent(subscription.status);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 text-zinc-100">
      {/* Top bar */}
      <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        </div>
      </div>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card and Stats */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <UserProfileCard
              name={user.name}
              username={user.username}
              tier={subscription.tier}
              // avatarUrl={user.avatarUrl}
              className="mb-2"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatTile icon={<BookOpen />} label="Books Completed" value={stats.booksCompleted} />
              <StatTile icon={<Flame />} label="Current Streak" value={stats.currentStreak + " days"} />
              <StatTile icon={<BarChart3 />} label="Avg. Minutes/Day" value={stats.avgMinutesPerDay} />
              <StatTile icon={<BookOpen />} label="Minutes Read" value={stats.minutesRead} />
            </div>

            {/* Genres */}
            <div className="mt-6">
              <div className="font-semibold mb-2">Favorite Genres</div>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-300 ring-1 ring-white/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div>
            <div className={`rounded-2xl p-6 ${subAccent} mb-6`}>
              <div className="font-bold text-lg mb-2">Subscription</div>
              <InfoRow label="Tier" value={subscription.tier} />
              <InfoRow label="Status" value={subscription.status} />
              <InfoRow label="Renews On" value={formatDate(subscription.renewsOn)} />
              <InfoRow label="Card Last 4" value={subscription.paymentMethodLast4} />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="font-semibold mb-4">Recent Activity</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recent.map((book) => (
            <div
              key={book.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2"
            >
              <div className="font-semibold">{book.title}</div>
              <div className="text-xs text-zinc-400">{book.author}</div>
              <Progress value={book.progress} />
              <div className="text-xs text-zinc-500">Last opened: {book.lastOpened}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-10 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} Nalandaa. All rights reserved.
      </footer>
    </main>
  );
}

function getSubAccent(status: SubStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/20";
    case "past_due":
      return "bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20";
    case "trialing":
      return "bg-sky-500/15 text-sky-500 ring-1 ring-sky-500/20";
    default:
      return "bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20";
  }
}

function StatTile({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/5 blur-xl" />
      <div className="flex items-center gap-2 text-zinc-300">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 rounded-full bg-zinc-700">
        <div
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
        />
      </div>
      <span className="text-xs text-zinc-400 tabular-nums">{value}%</span>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}
