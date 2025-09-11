"use client";

import { User as UserIcon, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserProfileCardProps {
  name: string;
  username: string;
  tier?: string;
  avatarUrl?: string;
  className?: string;
}

export function UserProfileCard({
  name,
  username,
  tier,
  avatarUrl,
  className,
}: UserProfileCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-800 ring-1 ring-white/20 overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full object-cover rounded-xl"
          />
        ) : (
          <UserIcon className="h-8 w-8 text-zinc-400" />
        )}
      </div>
      <div>
        <div className="font-semibold text-lg">{name}</div>
        <div className="text-zinc-400 text-sm">{username}</div>
        {tier && (
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium ring-1 ring-white/10">
            <Crown className="h-3.5 w-3.5" /> {tier}
          </div>
        )}
      </div>
    </div>
  );
}