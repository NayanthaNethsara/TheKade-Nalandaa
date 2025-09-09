"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { User, Mail, Phone, MapPin, Camera, Edit, Save, X, Upload, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface AddressChangeRequest {
  id: string
  currentAddress: string
  newAddress: string
  reason: string
  documents: File[]
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  adminNotes?: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [showAddressChange, setShowAddressChange] = useState(false)
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
    nic: session?.user?.nic || "",
    address: session?.user?.address || "",
  })

  const [addressChangeData, setAddressChangeData] = useState({
    newAddress: "",
    reason: "",
    documents: [] as File[],
  })

  const [pendingRequests, setPendingRequests] = useState<AddressChangeRequest[]>([
    {
      id: "1",
      currentAddress: "123 Main St, Colombo",
      newAddress: "456 New St, Kandy",
      reason: "Job relocation",
      documents: [],
      status: "pending",
      submittedDate: "2024-01-10",
    },
  ])

  const handleSaveProfile = () => {
    // Save basic profile changes (non-sensitive data)
    console.log("Saving profile:", profileData)
    setIsEditing(false)
  }

  const handleAddressChangeSubmit = () => {
    const newRequest: AddressChangeRequest = {
      id: Date.now().toString(),
      currentAddress: profileData.address,
      newAddress: addressChangeData.newAddress,
      reason: addressChangeData.reason,
      documents: addressChangeData.documents,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    }

    setPendingRequests([...pendingRequests, newRequest])
    setAddressChangeData({ newAddress: "", reason: "", documents: [] })
    setShowAddressChange(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setAddressChangeData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }))
    }
  }

  const removeDocument = (index: number) => {
    setAddressChangeData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your personal information and account settings
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-semibold">Personal Information</CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
              >
                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{profileData.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {session.user.role === "admin" ? "Administrator" : "Citizen"}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number</Label>
                  <Input
                    id="nic"
                    value={profileData.nic}
                    disabled
                    className="backdrop-blur-xl bg-gray-100/60 dark:bg-gray-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">NIC cannot be changed</p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Current Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      value={profileData.address}
                      disabled
                      className="pl-10 backdrop-blur-xl bg-gray-100/60 dark:bg-gray-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 cursor-not-allowed resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Address changes require admin approval</p>
                    <Button
                      onClick={() => setShowAddressChange(true)}
                      size="sm"
                      variant="outline"
                      className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    >
                      Request Address Change
                    </Button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-gray-600 hover:bg-gray-700 shadow-lg shadow-gray-600/20"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Address Change Requests */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Address Change Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-slate-700/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-gray-200 text-gray-900 dark:bg-gray-800/30 dark:text-gray-200">
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">Submitted: {request.submittedDate}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>From:</strong> {request.currentAddress}
                          </div>
                          <div>
                            <strong>To:</strong> {request.newAddress}
                          </div>
                          <div>
                            <strong>Reason:</strong> {request.reason}
                          </div>
                          <div>
                            <strong>Documents:</strong> {request.documents.length} file(s) uploaded
                          </div>
                        </div>
                      </div>
                      <AlertCircle className="h-5 w-5 text-gray-400 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Address Change Modal */}
        {showAddressChange && (
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
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Request Address Change</h2>
                  <Button onClick={() => setShowAddressChange(false)} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentAddress">Current Address</Label>
                    <Textarea
                      id="currentAddress"
                      value={profileData.address}
                      disabled
                      className="backdrop-blur-xl bg-gray-100/60 dark:bg-gray-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 cursor-not-allowed resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newAddress">New Address *</Label>
                    <Textarea
                      id="newAddress"
                      value={addressChangeData.newAddress}
                      onChange={(e) => setAddressChangeData((prev) => ({ ...prev, newAddress: e.target.value }))}
                      placeholder="Enter your new address..."
                      className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Change *</Label>
                    <Textarea
                      id="reason"
                      value={addressChangeData.reason}
                      onChange={(e) => setAddressChangeData((prev) => ({ ...prev, reason: e.target.value }))}
                      placeholder="Explain why you need to change your address..."
                      className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-0 shadow-lg shadow-black/5 dark:shadow-black/20 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Supporting Documents *</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="documents"
                        />
                        <Button
                          onClick={() => document.getElementById("documents")?.click()}
                          variant="outline"
                          className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Documents
                        </Button>
                        <span className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB each)</span>
                      </div>

                      {addressChangeData.documents.length > 0 && (
                        <div className="space-y-2">
                          {addressChangeData.documents.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button onClick={() => removeDocument(index)} variant="ghost" size="sm">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Required documents: Utility bill, lease agreement, employment letter, or other proof of residence
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setShowAddressChange(false)}
                      variant="outline"
                      className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg shadow-black/5 dark:shadow-black/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddressChangeSubmit}
                      disabled={
                        !addressChangeData.newAddress ||
                        !addressChangeData.reason ||
                        addressChangeData.documents.length === 0
                      }
                      className="bg-gray-600 hover:bg-gray-700 shadow-lg shadow-gray-600/20"
                    >
                      Submit Request
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
