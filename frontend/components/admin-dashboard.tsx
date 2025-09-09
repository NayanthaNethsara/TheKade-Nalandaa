"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  Search,
  Bus,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  service: string;
  location: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  queuePosition?: number;
  estimatedWait?: string;
  type: "transport" | "government" | "healthcare" | "education";
  userName: string;
  userEmail: string;
}

interface AddressChangeRequest {
  id: string;
  userName: string;
  userEmail: string;
  currentAddress: string;
  newAddress: string;
  reason: string;
  documents: string[];
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    service: "Bus Ticket - Colombo to Kandy",
    location: "Pettah Bus Station",
    date: "2024-01-15",
    time: "09:00",
    status: "confirmed",
    queuePosition: 3,
    estimatedWait: "15 mins",
    type: "transport",
    userName: "John Citizen",
    userEmail: "john@example.com",
  },
  {
    id: "2",
    service: "Passport Application",
    location: "Immigration Office - Colombo",
    date: "2024-01-16",
    time: "14:30",
    status: "pending",
    queuePosition: 12,
    estimatedWait: "45 mins",
    type: "government",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
  },
  {
    id: "3",
    service: "Medical Consultation",
    location: "National Hospital",
    date: "2024-01-17",
    time: "11:00",
    status: "confirmed",
    queuePosition: 5,
    estimatedWait: "25 mins",
    type: "healthcare",
    userName: "Bob Wilson",
    userEmail: "bob@example.com",
  },
];

const mockAddressRequests: AddressChangeRequest[] = [
  {
    id: "1",
    userName: "John Citizen",
    userEmail: "john@example.com",
    currentAddress: "123 Main St, Colombo",
    newAddress: "456 New St, Kandy",
    reason: "Job relocation",
    documents: ["employment_letter.pdf", "lease_agreement.pdf"],
    status: "pending",
    submittedDate: "2024-01-10",
  },
  {
    id: "2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    currentAddress: "789 Old Rd, Galle",
    newAddress: "321 Fresh Ave, Colombo",
    reason: "Family reasons",
    documents: ["family_certificate.pdf", "utility_bill.pdf"],
    status: "pending",
    submittedDate: "2024-01-12",
  },
];

const serviceIcons = {
  transport: Bus,
  government: Users,
  healthcare: Plus,
  education: Users,
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
  confirmed: "bg-gray-200 text-gray-900 dark:bg-gray-800/30 dark:text-gray-200",
  completed: "bg-gray-300 text-gray-900 dark:bg-gray-700/40 dark:text-gray-100",
  cancelled: "bg-gray-400 text-gray-900 dark:bg-gray-600/50 dark:text-gray-100",
  approved: "bg-gray-200 text-gray-900 dark:bg-gray-800/30 dark:text-gray-200",
  rejected: "bg-gray-400 text-gray-900 dark:bg-gray-600/50 dark:text-gray-100",
};

export default function AdminDashboard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [addressRequests, setAddressRequests] =
    useState<AddressChangeRequest[]>(mockAddressRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"appointments" | "requests">(
    "appointments"
  );

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || appointment.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleApproveRequest = (requestId: string) => {
    setAddressRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setAddressRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +12 from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  addressRequests.filter((req) => req.status === "pending")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Address changes</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+89 this week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Efficiency
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground">+2% improvement</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="flex space-x-4 border-b border-gray-200/30 dark:border-gray-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setActiveTab("appointments")}
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "appointments"
              ? "border-gray-600 text-gray-900 dark:text-gray-100"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          All Appointments
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "requests"
              ? "border-gray-600 text-gray-900 dark:text-gray-100"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Address Change Requests (
          {addressRequests.filter((req) => req.status === "pending").length})
        </button>
      </motion.div>

      {activeTab === "appointments" && (
        <>
          {/* Search and Filter */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className={
                  selectedFilter !== "all"
                    ? "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    : ""
                }
              >
                All
              </Button>
              <Button
                variant={selectedFilter === "transport" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("transport")}
                className={
                  selectedFilter !== "transport"
                    ? "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    : ""
                }
              >
                Transport
              </Button>
              <Button
                variant={
                  selectedFilter === "government" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedFilter("government")}
                className={
                  selectedFilter !== "government"
                    ? "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    : ""
                }
              >
                Government
              </Button>
              <Button
                variant={
                  selectedFilter === "healthcare" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedFilter("healthcare")}
                className={
                  selectedFilter !== "healthcare"
                    ? "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    : ""
                }
              >
                Healthcare
              </Button>
            </div>
          </motion.div>

          {/* Appointments List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredAppointments.map((appointment, index) => {
              const IconComponent = serviceIcons[appointment.type];
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gray-100/70 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-sm">
                            <IconComponent className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {appointment.service}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {appointment.location}
                            </div>
                            <div className="flex items-center space-x-4 text-sm mb-2">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {appointment.time}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>User:</strong> {appointment.userName} (
                              {appointment.userEmail})
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={statusColors[appointment.status]}>
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </Badge>

                          {appointment.queuePosition && (
                            <div className="text-right text-sm">
                              <div className="font-medium">
                                Queue: #{appointment.queuePosition}
                              </div>
                              <div className="text-gray-500">
                                ~{appointment.estimatedWait}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {activeTab === "requests" && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {addressRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {request.userName}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Email:</strong> {request.userEmail}
                        </div>
                        <div>
                          <strong>Current Address:</strong>{" "}
                          {request.currentAddress}
                        </div>
                        <div>
                          <strong>New Address:</strong> {request.newAddress}
                        </div>
                        <div>
                          <strong>Reason:</strong> {request.reason}
                        </div>
                        <div>
                          <strong>Documents:</strong>{" "}
                          {request.documents.join(", ")}
                        </div>
                        <div>
                          <strong>Submitted:</strong> {request.submittedDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={statusColors[request.status]}>
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>

                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(request.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
