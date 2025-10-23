"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
  CreditCard,
  Shield,
  Crown,
  Star,
  Zap,
  ArrowRight,
  Check,
  Settings,
  Bell,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SubscriptionStatus } from "@/types/subscription";

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  location?: string;
  phone?: string;
  profilePictureUrl?: string;
}

const subscriptionIcons = {
  Free: Zap,
  Premium: Star,
  Author: Crown,
};

const subscriptionColors = {
  Free: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  Premium:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Author: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    profilePictureUrl: "",
  });
  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    if (session?.user) {
      const userProfile: UserProfile = {
        name: session.user.name || "",
        email: session.user.email || "",
        bio: "",
        location: "",
        phone: "",
        profilePictureUrl: "",
      };
      setProfile(userProfile);
      setFormData(userProfile);
    }
  }, [session]);

  const subscription =
    (session?.user?.subscription as SubscriptionStatus) || "Free";
  const role = session?.user?.role || "Reader";
  const userId = session?.user?.sub;
  const Icon = subscriptionIcons[subscription];
  const badgeColor = subscriptionColors[subscription];

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(profile);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual profile update API call
      // For now, just update local state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile(formData);

      // Update session if name changed
      if (formData.name !== session?.user?.name && session) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
          },
        });
      }

      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            Please login to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profile.profilePictureUrl}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{role}</Badge>
                      <Badge className={cn("", badgeColor)}>
                        <Icon className="h-3 w-3 mr-1" />
                        {subscription}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                {!editMode ? (
                  <Button onClick={handleEdit} variant="outline">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="inline h-4 w-4 mr-1" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true}
                      placeholder="your@email.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Brief description for your profile. Maximum 200 characters.
                </p>
              </div>

              <Separator />

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Account Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">User ID</Label>
                    <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                      #{userId}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Member Since
                    </Label>
                    <p className="text-sm bg-muted px-3 py-2 rounded">
                      {session.user.accessTokenExpires
                        ? formatDate(Date.now() - 30 * 24 * 60 * 60 * 1000) // Mock: 30 days ago
                        : "Recently"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Account Type
                    </Label>
                    <p className="text-sm bg-muted px-3 py-2 rounded">{role}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Account Status
                    </Label>
                    <p className="text-sm bg-muted px-3 py-2 rounded flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Manage your subscription plan and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{subscription} Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Current subscription
                      </p>
                    </div>
                  </div>
                  <Badge className={cn("text-sm px-3 py-1", badgeColor)}>
                    Active
                  </Badge>
                </div>

                {/* Plan Features */}
                <div className="space-y-2 mb-4">
                  {subscription === "Free" && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Access to free books</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Basic reading features</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Limited bookmarks</span>
                      </div>
                    </>
                  )}
                  {subscription === "Premium" && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Access to all books</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Unlimited bookmarks</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Ad-free experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Offline reading</span>
                      </div>
                    </>
                  )}
                  {subscription === "Author" && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>All Premium features</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Publish your own books</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Analytics & insights</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Revenue sharing</span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/subscription")}
                >
                  {subscription === "Free"
                    ? "Upgrade Plan"
                    : "Manage Subscription"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <Separator />

              {/* Billing Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Billing Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">
                      Billing Cycle
                    </span>
                    <span className="text-sm font-medium">Monthly</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">
                      Next Billing Date
                    </span>
                    <span className="text-sm font-medium">
                      {subscription === "Free"
                        ? "N/A"
                        : formatDate(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span className="text-sm font-medium">
                      {subscription === "Free" && "$0.00"}
                      {subscription === "Premium" && "$9.99"}
                      {subscription === "Author" && "$19.99"}
                    </span>
                  </div>
                </div>
              </div>

              {subscription !== "Free" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Method
                    </h3>
                    <div className="border rounded-lg p-4 flex items-center gap-4">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          •••• •••• •••• 4242
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expires 12/26
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Password</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-xs text-muted-foreground">
                          Last changed 30 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">2FA Status</p>
                      <p className="text-xs text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <Button className="mt-4" variant="outline">
                  Enable 2FA
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Current Device</p>
                      <p className="text-xs text-muted-foreground">
                        {typeof navigator !== "undefined"
                          ? navigator.userAgent.split("(")[1]?.split(")")[0]
                          : "Desktop"}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Email Notifications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Push Notifications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Browser notifications
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Disabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Newsletter</p>
                        <p className="text-xs text-muted-foreground">
                          Weekly book recommendations
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Enabled
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Reading Preferences
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Theme</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Light
                      </Button>
                      <Button variant="outline" size="sm">
                        Dark
                      </Button>
                      <Button variant="default" size="sm">
                        System
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Small
                      </Button>
                      <Button variant="default" size="sm">
                        Medium
                      </Button>
                      <Button variant="outline" size="sm">
                        Large
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                  Danger Zone
                </h3>
                <div className="space-y-3">
                  <div className="border border-red-200 dark:border-red-900 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Delete Account</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
