"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Check,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Author } from "@/types/users";

export default function AdminAuthorsApprovalPage() {
  const [pendingAuthors, setPendingAuthors] = useState<Author[]>([]);
  const [approvedAuthors, setApprovedAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      // Fetch pending authors
      const pendingResponse = await fetch("/api/admin/users/author");
      if (pendingResponse.ok) {
        const authors = await pendingResponse.json();
        setPendingAuthors(
          (Array.isArray(authors) ? authors : authors.users || []).filter(
            (a: Author) => !a.active
          )
        );
        setApprovedAuthors(
          (Array.isArray(authors) ? authors : authors.users || []).filter(
            (a: Author) => a.active
          )
        );
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      toast.error("Failed to fetch authors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (authorId: string) => {
    setApproving(authorId);
    try {
      const response = await fetch(`/api/admin/users/${authorId}/activate`, {
        method: "PATCH",
      });
      if (response.ok) {
        toast.success("Author approved successfully!");
        fetchAuthors();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve author");
      }
    } catch (error) {
      console.error("Error approving author:", error);
      toast.error("Failed to approve author");
    } finally {
      setApproving(null);
    }
  };

  const filteredPendingAuthors = pendingAuthors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApprovedAuthors = approvedAuthors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Author Approval</h1>
          <Button onClick={fetchAuthors} disabled={loading}>
            Refresh
          </Button>
        </div>
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search authors..."
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
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAuthors.length}</div>
            <p className="text-xs text-muted-foreground">
              Authors waiting for approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Authors
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedAuthors.length}</div>
            <p className="text-xs text-muted-foreground">
              Authors available in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingAuthors.length + approvedAuthors.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All authors in the system
            </p>
          </CardContent>
        </Card>
      </motion.div>
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending ({pendingAuthors.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved ({approvedAuthors.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Authors Awaiting Approval</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredPendingAuthors.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No pending authors found
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingAuthors.map((author) => (
                        <TableRow key={author.id}>
                          <TableCell className="font-medium">
                            {author.name}
                          </TableCell>
                          <TableCell>{author.email}</TableCell>
                          <TableCell>
                            {author.createdAt
                              ? new Date(author.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => setSelectedAuthor(author)}
                                variant="outline"
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(author.id!)}
                                disabled={approving === author.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {approving === author.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Authors</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredApprovedAuthors.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No approved authors found
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApprovedAuthors.map((author) => (
                        <TableRow key={author.id}>
                          <TableCell className="font-medium">
                            {author.name}
                          </TableCell>
                          <TableCell>{author.email}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Approved
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => setSelectedAuthor(author)}
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
      <Dialog
        open={!!selectedAuthor}
        onOpenChange={() => setSelectedAuthor(null)}
      >
        <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 max-w-md">
          <DialogHeader>
            <DialogTitle>Author Details</DialogTitle>
          </DialogHeader>
          {selectedAuthor && (
            <div className="space-y-6">
              <p>
                <strong>Name:</strong> {selectedAuthor.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedAuthor.email}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedAuthor.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedAuthor.active ? "Approved" : "Pending"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
