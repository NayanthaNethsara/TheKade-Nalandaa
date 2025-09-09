"use client";
import { 
  BadgeCheck, Bell, BookOpen, CalendarDays, ChevronRight, Crown,
  Edit3, LogOut, Settings, ShieldCheck, Star, TrendingUp,
  User as UserIcon, Book
} from "lucide-react";

type SubStatus = "active" | "past_due" | "canceled" | "trialing";

export default function UserProfileDashboard() {
  // These are example data I used just for the showcase. These are to be replaced with API data
  const user = {
    name: "User Name",
    username: "@example_user",
    joinedAt: "2024-10-02",
  };

  const subscription: { tier: string; status: SubStatus; renewsOn: string; paymentMethodLast4: string } = {
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
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 shadow-lg shadow-rose-900/30" />
            <span className="font-semibold tracking-tight">Nalandaa</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
              <Bell className="h-4 w-4" />
              Alerts
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (Will be replaced with API data) */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 sm:p-8">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-tr from-amber-400/10 to-rose-500/10 blur-2xl" />
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800 ring-1 ring-white/20">
                  <UserIcon className="h-10 w-10 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                      {user.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium ring-1 ring-white/10">
                      <UserIcon className="h-3.5 w-3.5" /> {user.username}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${subAccent}`}
                    >
                      <Crown className="h-3.5 w-3.5" /> {subscription.tier}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatTile icon={<BookOpen className="h-4 w-4" />} label="Books completed" value={stats.booksCompleted} />
                    <StatTile icon={<TrendingUp className="h-4 w-4" />} label="Reading streak" value={`${stats.currentStreak} days`} />
                    <StatTile icon={<CalendarDays className="h-4 w-4" />} label="Avg mins / day" value={stats.avgMinutesPerDay} />
                    <StatTile icon={<Star className="h-4 w-4" />} label="Total minutes" value={stats.minutesRead} />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {genres.map((g) => (
                      <span key={g} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium ring-1 ring-white/10">
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
                      <Edit3 className="h-4 w-4" /> Edit profile
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
                      <ShieldCheck className="h-4 w-4" /> Privacy
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-sm hover:bg-rose-500/15 transition">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Card (Will be replaced with API data) */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 sm:p-8">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/10 to-sky-500/10 blur-2xl" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-400" />
                    <h2 className="text-lg font-semibold">Subscription</h2>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">
                    {subscription.tier} plan · {subscription.status}
                  </p>
                </div>
                <BadgeCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
                <InfoRow label="Renews on" value={formatDate(subscription.renewsOn)} />
                <InfoRow label="Payment" value={`•••• •••• •••• ${subscription.paymentMethodLast4}`} />
                <InfoRow label="Member since" value={formatDate(user.joinedAt)} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm hover:bg-emerald-500/15 transition">
                  Manage plan <ChevronRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
                  Billing history
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Continue reading</h3>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
              View library
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((b) => (
              <article key={b.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <div className="aspect-[16/9] w-full flex items-center justify-center bg-zinc-800">
                  <Book className="h-10 w-10 text-zinc-400" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium leading-tight line-clamp-1">{b.title}</h4>
                  <p className="mt-1 text-sm text-zinc-400 line-clamp-1">{b.author}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Progress value={b.progress} />
                    <span className="text-xs text-zinc-400">{b.lastOpened}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Nalandaa · Read more, every day.
        </div>
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
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/5 blur-xl" />
      <div className="flex items-center gap-2 text-zinc-300">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 ring-1 ring-white/10">
          {icon}
        </span>
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
        <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
      </div>
      <span className="text-xs text-zinc-400 tabular-nums">{value}%</span>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}
