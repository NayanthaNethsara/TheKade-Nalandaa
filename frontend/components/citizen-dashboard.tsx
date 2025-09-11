"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  Bus,
  BookOpen,
  Heart,
  Building,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  },
];

const serviceIcons = {
  transport: Bus,
  government: Building,
  healthcare: Heart,
  education: BookOpen,
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
  confirmed: "bg-gray-200 text-gray-900 dark:bg-gray-800/30 dark:text-gray-200",
  completed: "bg-gray-300 text-gray-900 dark:bg-gray-700/40 dark:text-gray-100",
  cancelled: "bg-gray-400 text-gray-900 dark:bg-gray-600/50 dark:text-gray-100",
};

const availableServices = [
  {
    name: "Transport Services",
    icon: Bus,
    count: 12,
    description: "Bus tickets, train reservations",
  },
  {
    name: "Government Services",
    icon: Building,
    count: 8,
    description: "Passport, NIC, licenses",
  },
  {
    name: "Healthcare Services",
    icon: Heart,
    count: 15,
    description: "Hospital appointments, checkups",
  },
  {
    name: "Education Services",
    icon: BookOpen,
    count: 6,
    description: "University admissions, certificates",
  },
];

export default function CitizenDashboard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Book New Appointment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Schedule your next service
                  </p>
                </div>
                <Button className="bg-gray-600 hover:bg-gray-700 shadow-lg shadow-gray-600/20">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    My Appointments
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appointments.length} active bookings
                  </p>
                </div>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {appointments.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Available Services */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gray-100/70 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{service.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {service.count} locations
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* My Appointments */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Appointments</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => {
            const IconComponent = serviceIcons[appointment.type];
            return (
              <motion.div
                key={appointment.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
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
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              {appointment.time}
                            </div>
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
        </div>
      </motion.div>

      {filteredAppointments.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Book your first appointment to get started
          </p>
        </motion.div>
      )}
    </div>
  );
}
