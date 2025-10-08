"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [user, setUser] = useState({
    id: "1",
    name: "Nayantha Nethsara",
    email: "nayantha@example.com",
    role: "Reader",
    avatarUrl: "/avatar.png",
    subscription: "free",
    bio: "Book lover. Software engineer. Always learning.",
    joined: "2024-01-15",
    location: "Colombo, Sri Lanka",
    phone: "0771234567",
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    location: user.location,
    phone: user.phone,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setUser((u) => ({ ...u, ...form }));
      setEditMode(false);
      setSaving(false);
      setSuccess(true);
    }, 1200);
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    setUpgradeSuccess(false);
    // Mock payment process
    try {
      // Call backend API to update subscription
      await fetch(`/api/users/readers/${user.id}/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionType: "premium" }),
      });

      // Simulate processing time
      setTimeout(() => {
        setUser((u) => ({ ...u, subscription: "premium" }));
        setUpgrading(false);
        setUpgradeSuccess(true);
      }, 1500);
    } catch (error) {
      setUpgrading(false);
      console.error("Upgrade failed:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto shadow-md rounded-2xl">
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>
              {user.name.charAt(0)}
              {user.name.split(" ")[1]?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.role}</p>
            <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">
              {user.subscription === "premium" ? "Premium" : "Free"} Plan
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Form */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                readOnly={!editMode}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                readOnly={!editMode}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                readOnly={!editMode}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                readOnly={!editMode}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                readOnly={!editMode}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="joined">Joined</Label>
              <Input
                id="joined"
                value={user.joined}
                readOnly
                className="mt-1"
              />
            </div>
          </div>

          {/* Subscription Section */}
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">Subscription</h3>
            <div>
              <span className="font-semibold">Current Plan:</span>
              <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                {user.subscription === "premium" ? "Premium" : "Free"}
              </span>
            </div>

            <div className="mt-4">
              {user.subscription === "free" ? (
                <Button
                  variant="default"
                  disabled={upgrading}
                  onClick={handleUpgrade}
                >
                  {upgrading ? "Processing..." : "Upgrade to Premium"}
                </Button>
              ) : (
                <span className="text-green-600 font-medium">
                  ✓ Premium Active
                </span>
              )}
            </div>

            {user.subscription === "free" && (
              <div className="mt-4 text-sm text-muted-foreground">
                <strong>Special Offer:</strong> 100% discount! Upgrade to
                premium for free.
                <br />
                <span className="text-xs">(Mock payment, no real charge)</span>
              </div>
            )}

            {upgradeSuccess && (
              <div className="mt-4 text-green-600 text-sm font-medium">
                ✨ Congratulations! Your premium plan is now active.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end mt-6">
            {!editMode ? (
              <Button variant="default" onClick={handleEdit}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>

          {success && (
            <div className="mt-2 text-green-600 text-sm">
              Profile updated successfully!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
