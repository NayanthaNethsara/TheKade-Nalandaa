"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Search, Users, BadgeCheck, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Reader, Author } from "@/types/users";

export default function AdminUserManagementPage() {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Reader | Author | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"reader" | "author">("reader");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [readersRes, authorsRes] = await Promise.all([
        fetch("/api/admin/users/readers"),
        fetch("/api/admin/users/author"),
      ]);
      const readersData = await readersRes.json();
      const authorsData = await authorsRes.json();
      setReaders(
        Array.isArray(readersData) ? readersData : readersData.users || []
      );
      setAuthors(
        Array.isArray(authorsData) ? authorsData : authorsData.users || []
      );
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredReaders = readers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubscription =
      subscriptionFilter === "all" || user.subscription === subscriptionFilter;
    return matchesSearch && matchesSubscription;
  });

  const filteredAuthors = authors.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? user.active : !user.active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <Button onClick={fetchUsers} disabled={loading}>
            Refresh
          </Button>
        </div>
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readers</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readers.length}</div>
            <p className="text-xs text-muted-foreground">Total readers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authors</CardTitle>
            <BadgeCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authors.length}</div>
            <p className="text-xs text-muted-foreground">Total authors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readers.length + authors.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All users in the system
            </p>
          </CardContent>
        </Card>
      </motion.div>
      {/* Tab Switch UI for Readers/Authors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "reader" | "author")}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="reader">Readers</TabsTrigger>
            <TabsTrigger value="author">Authors</TabsTrigger>
          </TabsList>
          <TabsContent value="reader">
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                Subscription:
                <select
                  value={subscriptionFilter}
                  onChange={(e) => setSubscriptionFilter(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </label>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Readers</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredReaders.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No readers found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReaders.map((reader) => (
                        <TableRow key={reader.id}>
                          <TableCell className="font-medium">
                            {reader.name}
                          </TableCell>
                          <TableCell>{reader.email}</TableCell>
                          <TableCell>
                            <Badge>{reader.subscription}</Badge>
                          </TableCell>
                          <TableCell>
                            {reader.createdAt
                              ? new Date(reader.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => setSelectedUser(reader)}
                              variant="outline"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="author">
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                Status:
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </label>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Authors</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredAuthors.length === 0 ? (
                  <div className="text-center py-8">
                    <BadgeCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No authors found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAuthors.map((author) => (
                        <TableRow key={author.id}>
                          <TableCell className="font-medium">
                            {author.name}
                          </TableCell>
                          <TableCell>{author.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                author.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {author.active ? "Active" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {author.createdAt
                              ? new Date(author.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => setSelectedUser(author)}
                              variant="outline"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      {/* View Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              {"subscription" in selectedUser && (
                <p>
                  <strong>Subscription:</strong> {selectedUser.subscription}
                </p>
              )}
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleString()}
              </p>
              {"active" in selectedUser && (
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.active ? "Active" : "Pending"}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
