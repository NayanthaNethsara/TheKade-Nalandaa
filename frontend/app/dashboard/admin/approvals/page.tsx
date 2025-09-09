"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Calendar,
  User,
  MapPin,
  MessageSquare,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface AddressChangeRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userNIC: string;
  currentAddress: string;
  newAddress: string;
  reason: string;
  documents: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  reviewedDate?: string;
  adminNotes?: string;
  reviewedBy?: string;
}

const mockRequests: AddressChangeRequest[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Citizen",
    userEmail: "john@example.com",
    userNIC: "123456789V",
    currentAddress: "123 Main St, Colombo 01",
    newAddress: "456 New Street, Kandy",
    reason: "Job relocation to Kandy office. Starting new position next month.",
    documents: [
      { name: "employment_letter.pdf", type: "pdf", size: 2.5, url: "#" },
      { name: "lease_agreement.pdf", type: "pdf", size: 1.8, url: "#" },
      { name: "utility_bill.jpg", type: "image", size: 0.9, url: "#" },
    ],
    status: "pending",
    submittedDate: "2024-01-10",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userNIC: "987654321V",
    currentAddress: "789 Old Road, Galle",
    newAddress: "321 Fresh Avenue, Colombo 03",
    reason: "Moving closer to family for elderly care responsibilities.",
    documents: [
      { name: "family_certificate.pdf", type: "pdf", size: 1.2, url: "#" },
      { name: "medical_certificate.pdf", type: "pdf", size: 0.8, url: "#" },
      { name: "new_address_proof.jpg", type: "image", size: 1.1, url: "#" },
    ],
    status: "pending",
    submittedDate: "2024-01-12",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Bob Wilson",
    userEmail: "bob@example.com",
    userNIC: "456789123V",
    currentAddress: "555 Beach Road, Negombo",
    newAddress: "777 Hill View, Nuwara Eliya",
    reason: "Retirement relocation to cooler climate.",
    documents: [
      { name: "retirement_letter.pdf", type: "pdf", size: 1.5, url: "#" },
      { name: "property_deed.pdf", type: "pdf", size: 3.2, url: "#" },
    ],
    status: "approved",
    submittedDate: "2024-01-08",
    reviewedDate: "2024-01-15",
    adminNotes: "All documents verified. Retirement confirmed.",
    reviewedBy: "Admin User",
  },
];

const statusColors = {
  pending: "bg-gray-200 text-gray-900 dark:bg-gray-800/30 dark:text-gray-200",
  approved: "bg-gray-300 text-gray-900 dark:bg-gray-700/40 dark:text-gray-100",
  rejected: "bg-gray-400 text-gray-900 dark:bg-gray-600/50 dark:text-gray-100",
};

export default function AdminApprovalsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] =
    useState<AddressChangeRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<AddressChangeRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");

  // Redirect if not admin
  if (session?.user?.role !== "ADMIN") {
    router.push("/dashboard");
    return null;
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userNIC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.newAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.currentAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleReviewRequest = (
    request: AddressChangeRequest,
    action: "approve" | "reject"
  ) => {
    setSelectedRequest(request);
    setReviewAction(action);
    setAdminNotes("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    if (!selectedRequest || !reviewAction) return;

    const updatedRequest = {
      ...selectedRequest,
      status:
        reviewAction === "approve"
          ? ("approved" as const)
          : ("rejected" as const),
      reviewedDate: new Date().toISOString().split("T")[0],
      adminNotes,
      reviewedBy: session?.user?.username || "ADMIN",
    };

    setRequests((prev) =>
      prev.map((req) => (req.id === selectedRequest.id ? updatedRequest : req))
    );
    setShowReviewModal(false);
    setSelectedRequest(null);
    setReviewAction(null);
    setAdminNotes("");
  };

  const pendingCount = requests.filter(
    (req) => req.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Address Change Approvals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Review and approve citizen address change requests
          </p>
          <div className="flex justify-center">
            <Badge className="bg-gray-200 text-gray-900 dark:bg-gray-800/30 dark:text-gray-200 text-lg px-4 py-2">
              {pendingCount} Pending Request{pendingCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, NIC, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Requests List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100/70 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg">
                          <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                            {request.userName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{request.userEmail}</span>
                            <span>NIC: {request.userNIC}</span>
                          </div>
                        </div>
                      </div>

                      {/* Address Change Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Address
                          </Label>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.currentAddress}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Address
                          </Label>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.newAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reason
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {request.reason}
                        </p>
                      </div>

                      {/* Documents */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Supporting Documents ({request.documents.length})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {request.documents.map((doc, docIndex) => (
                            <div
                              key={docIndex}
                              className="flex items-center space-x-2 px-3 py-1 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 rounded-lg text-sm"
                            >
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span>{doc.name}</span>
                              <span className="text-gray-500">
                                ({doc.size}MB)
                              </span>
                              <Button variant="ghost" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submission Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {request.submittedDate}</span>
                        </div>
                        {request.reviewedDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Reviewed: {request.reviewedDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Admin Notes */}
                      {request.adminNotes && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Admin Notes
                          </Label>
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.adminNotes}
                            </p>
                          </div>
                          {request.reviewedBy && (
                            <p className="text-xs text-gray-500">
                              Reviewed by: {request.reviewedBy}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      <Badge className={statusColors[request.status]}>
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>

                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleReviewRequest(request, "approve")
                            }
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleReviewRequest(request, "reject")
                            }
                            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedRequest(request)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredRequests.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No requests found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedRequest && reviewAction && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full max-w-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {reviewAction === "approve" ? "Approve" : "Reject"} Address
                    Change Request
                  </h2>
                  <Button
                    onClick={() => setShowReviewModal(false)}
                    variant="ghost"
                    size="sm"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <h3 className="font-medium mb-2">Request Summary</h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <strong>User:</strong> {selectedRequest.userName} (
                        {selectedRequest.userEmail})
                      </p>
                      <p>
                        <strong>From:</strong> {selectedRequest.currentAddress}
                      </p>
                      <p>
                        <strong>To:</strong> {selectedRequest.newAddress}
                      </p>
                      <p>
                        <strong>Reason:</strong> {selectedRequest.reason}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminNotes">
                      Admin Notes{" "}
                      {reviewAction === "reject" ? "(Required)" : "(Optional)"}
                    </Label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder={
                        reviewAction === "approve"
                          ? "Add any notes about the approval..."
                          : "Please provide a reason for rejection..."
                      }
                      className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setShowReviewModal(false)}
                      variant="outline"
                      className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={reviewAction === "reject" && !adminNotes.trim()}
                      className={
                        reviewAction === "approve"
                          ? "bg-gray-600 hover:bg-gray-700 text-white"
                          : "bg-gray-500 hover:bg-gray-600 text-white"
                      }
                    >
                      {reviewAction === "approve" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Request
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Request
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
