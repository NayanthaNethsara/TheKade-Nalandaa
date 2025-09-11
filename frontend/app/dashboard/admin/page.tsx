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
  subscription?: string;
  createdAt: string;
  isActive: boolean;
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
  const [confirmAction, setConfirmAction] = useState<{
    user: User;
    type: "activate" | "deactivate";
  } | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users/readers"); // update route if needed
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
              "Name,Email,User Type,Subscription,Created At,Active",
              ...filteredUsers.map(
                (u) =>
                  `${u.name},${u.email},${u.userType},${
                    u.subscription || "N/A"
                  },${u.createdAt},${u.isActive ? "Active" : "Inactive"}`
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleExport("csv")}
                  className="h-12 px-6"
                >
                  <Download className="h-5 w-5 mr-2" /> Export CSV
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 h-14">
                  <TabsTrigger
                    value="all"
                    className="h-12 text-base font-medium"
                  >
                    <Users className="h-5 w-5 mr-2" /> All Users ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger
                    value="reader"
                    className="h-12 text-base font-medium"
                  >
                    <BookOpen className="h-5 w-5 mr-2" /> Readers (
                    {stats.readers})
                  </TabsTrigger>
                  <TabsTrigger
                    value="author"
                    className="h-12 text-base font-medium"
                  >
                    <PenTool className="h-5 w-5 mr-2" /> Authors (
                    {stats.authors})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="all" className="mt-0">
                  <UserTable
                    users={filteredUsers}
                    setSelectedUser={setSelectedUser}
                    setConfirmAction={setConfirmAction}
                  />
                </TabsContent>
                <TabsContent value="reader" className="mt-0">
                  <UserTable
                    users={filteredUsers.filter((u) => u.userType === "reader")}
                    setSelectedUser={setSelectedUser}
                    setConfirmAction={setConfirmAction}
                  />
                </TabsContent>
                <TabsContent value="author" className="mt-0">
                  <UserTable
                    users={filteredUsers.filter((u) => u.userType === "author")}
                    setSelectedUser={setSelectedUser}
                    setConfirmAction={setConfirmAction}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
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
              <p>
                <strong>Type:</strong> {selectedUser.userType}
              </p>
              {selectedUser.userType === "reader" && (
                <p>
                  <strong>Subscription:</strong>{" "}
                  {selectedUser.subscription || "None"}
                </p>
              )}
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Activate/Deactivate Dialog */}
      <Dialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "activate" ? "Activate" : "Deactivate"}{" "}
              User
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            Are you sure you want to {confirmAction?.type} user{" "}
            <strong>{confirmAction?.user.name}</strong>?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant={
                confirmAction?.type === "activate" ? "default" : "destructive"
              }
              onClick={async () => {
                if (!confirmAction) return;
                try {
                  const res = await fetch(
                    `/api/users/${confirmAction.user.id}/${confirmAction.type}`,
                    { method: "PATCH" }
                  );
                  if (!res.ok) throw new Error("Action failed");
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === confirmAction.user.id
                        ? { ...u, isActive: confirmAction.type === "activate" }
                        : u
                    )
                  );
                  setConfirmAction(null);
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              {confirmAction?.type === "activate" ? "Activate" : "Deactivate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reusable UserTable Component
type UserTableProps = {
  users: User[];
  setSelectedUser: (user: User) => void;
  setConfirmAction: (action: {
    user: User;
    type: "activate" | "deactivate";
  }) => void;
};

function UserTable({
  users,
  setSelectedUser,
  setConfirmAction,
}: UserTableProps) {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>
                  {user.subscription ? (
                    <Badge>{user.subscription}</Badge>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        <Eye className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setConfirmAction({
                            user,
                            type: user.isActive ? "deactivate" : "activate",
                          })
                        }
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
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
  );
}
