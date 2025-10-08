"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  BarChart3,
  UserCheck,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboardSummary() {
  // Example stats, replace with real API calls as needed
  const stats = {
    users: 1200,
    authors: 300,
    readers: 900,
    books: 1500,
    activeAuthors: 220,
    pendingAuthors: 80,
    activity: [12, 19, 3, 5, 2, 3],
  };
  const loading = false;

  // Example: fetch stats from backend
  // useEffect(() => { ... }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Analytics</h1>
          <Button
            onClick={() => toast.info("Refresh coming soon!")}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </motion.div>
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              All users in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authors</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.authors}</div>
            <p className="text-xs text-muted-foreground">Total authors</p>
            <div className="flex gap-2 mt-2">
              <BadgeCheck className="h-4 w-4 text-green-500" /> Active:{" "}
              {stats.activeAuthors}
              <BadgeCheck className="h-4 w-4 text-yellow-500" /> Pending:{" "}
              {stats.pendingAuthors}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readers</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readers}</div>
            <p className="text-xs text-muted-foreground">Total readers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.books}</div>
            <p className="text-xs text-muted-foreground">Books in the system</p>
          </CardContent>
        </Card>
      </motion.div>
      {/* Analytics Graphs (Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>User Activity (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Replace with real chart */}
            <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
              <BarChart3 className="h-16 w-16 text-gray-400" />
              <span className="ml-4 text-muted-foreground">
                [Graph Placeholder]
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Book Additions (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Replace with real chart */}
            <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
              <BarChart3 className="h-16 w-16 text-gray-400" />
              <span className="ml-4 text-muted-foreground">
                [Graph Placeholder]
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
