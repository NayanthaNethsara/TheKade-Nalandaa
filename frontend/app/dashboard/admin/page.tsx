"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Eye,
  Mail,
  Calendar,
  Download,
  MoreHorizontal,
  BookOpen,
  PenTool,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type User = {
  id: string;
  name: string;
  email: string;
  userType: "reader" | "author";
  subscription?: string; // Optional since authors don't have subscriptions
  createdAt: string;
};

const subscriptionColors = {
  free: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
  premium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [subscriptionFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUserType =
        activeTab === "all" || user.userType === activeTab;
      const matchesSubscription =
        subscriptionFilter === "all" ||
        (user.userType === "reader" &&
          user.subscription === subscriptionFilter);
      return matchesSearch && matchesUserType && matchesSubscription;
    });
  }, [users, searchTerm, activeTab, subscriptionFilter]);

  const stats = useMemo(() => {
    const readers = users.filter((u) => u.userType === "reader");
    const authors = users.filter((u) => u.userType === "author");

    return {
      total: users.length,
      readers: readers.length,
      authors: authors.length,
      freeReaders: readers.filter((r) => r.subscription === "free").length,
      premiumReaders: readers.filter((r) => r.subscription === "premium")
        .length,
    };
  }, [users]);

  const handleExport = async (format: "csv" | "json") => {
    try {
      const dataStr =
        format === "json"
          ? JSON.stringify(filteredUsers, null, 2)
          : [
              "Name,Email,User Type,Subscription,Created At",
              ...filteredUsers.map(
                (u) =>
                  `${u.name},${u.email},${u.userType},${
                    u.subscription || "N/A"
                  },${u.createdAt}`
              ),
            ].join("\n");

      const blob = new Blob([dataStr], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
          <CardContent className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-1 mb-6"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                User Management
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage readers and authors, monitor subscriptions, and track
                user activity.
              </p>
            </motion.div>
            <div className="space-y-6">
              {/* Search and Export Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 text-base"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleExport("csv")}
                  className="h-12 px-6 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* Tabs Navigation */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-14 bg-gray-100/50 dark:bg-gray-800/50">
                  <TabsTrigger
                    value="all"
                    className="h-12 text-base font-medium"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    All Users ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger
                    value="reader"
                    className="h-12 text-base font-medium"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Readers ({stats.readers})
                  </TabsTrigger>
                  <TabsTrigger
                    value="author"
                    className="h-12 text-base font-medium"
                  >
                    <PenTool className="h-5 w-5 mr-2" />
                    Authors ({stats.authors})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsContent value="all" className="mt-0">
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200 dark:border-gray-700">
                          <TableHead className="py-4 px-6">User</TableHead>
                          <TableHead className="py-4">Email</TableHead>
                          <TableHead className="py-4">Type</TableHead>
                          <TableHead className="py-4">Subscription</TableHead>
                          <TableHead className="py-4">Created At</TableHead>
                          <TableHead className="w-12 py-4"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                          >
                            <TableCell className="py-4 px-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {user.name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {user.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-2">
                                {user.userType === "reader" ? (
                                  <BookOpen className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <PenTool className="h-4 w-4 text-green-600" />
                                )}
                                <span className="capitalize font-medium">
                                  {user.userType}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {user.userType === "reader" &&
                              user.subscription ? (
                                <Badge
                                  className={
                                    subscriptionColors[
                                      user.subscription as keyof typeof subscriptionColors
                                    ]
                                  }
                                >
                                  {user.subscription}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reader" className="mt-0">
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200 dark:border-gray-700">
                          <TableHead className="py-6 px-8 text-base font-semibold">
                            Reader
                          </TableHead>
                          <TableHead className="py-6 text-base font-semibold">
                            Email
                          </TableHead>
                          <TableHead className="py-6 text-base font-semibold">
                            Subscription
                          </TableHead>
                          <TableHead className="py-6 text-base font-semibold">
                            Created At
                          </TableHead>
                          <TableHead className="w-12 py-6"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers
                          .filter((user) => user.userType === "reader")
                          .map((user) => (
                            <TableRow
                              key={user.id}
                              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                            >
                              <TableCell className="py-6 px-8">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {user.name.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100 text-base">
                                    {user.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                  <Mail className="h-5 w-5" />
                                  <span className="text-base">
                                    {user.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                {user.subscription ? (
                                  <Badge
                                    className={`${
                                      subscriptionColors[
                                        user.subscription as keyof typeof subscriptionColors
                                      ]
                                    } text-sm px-3 py-1`}
                                  >
                                    {user.subscription}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-400 text-base">
                                    No subscription
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-6">
                                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-5 w-5" />
                                  <span className="text-base">
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-10 w-10"
                                    >
                                      <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => setSelectedUser(user)}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="author" className="mt-0">
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200 dark:border-gray-700">
                          <TableHead className="py-6 px-8 text-base font-semibold">
                            Author
                          </TableHead>
                          <TableHead className="py-6 text-base font-semibold">
                            Email
                          </TableHead>
                          <TableHead className="py-6 text-base font-semibold">
                            Created At
                          </TableHead>
                          <TableHead className="w-12 py-6"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers
                          .filter((user) => user.userType === "author")
                          .map((user) => (
                            <TableRow
                              key={user.id}
                              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                            >
                              <TableCell className="py-6 px-8">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {user.name.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100 text-base">
                                    {user.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                  <Mail className="h-5 w-5" />
                                  <span className="text-base">
                                    {user.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-5 w-5" />
                                  <span className="text-base">
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-10 w-10"
                                    >
                                      <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => setSelectedUser(user)}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Name
                </label>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {selectedUser.name}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {selectedUser.email}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  User Type
                </label>
                <p className="text-lg text-gray-900 dark:text-gray-100 capitalize">
                  {selectedUser.userType}
                </p>
              </div>
              {selectedUser.userType === "reader" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Subscription
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100 capitalize">
                    {selectedUser.subscription || "None"}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Created At
                </label>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredUsers.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
            No users found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Try adjusting your search or filter criteria.
          </p>
        </motion.div>
      )}
    </div>
  );
}
