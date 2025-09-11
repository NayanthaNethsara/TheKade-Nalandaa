"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const user = {
    name: "Nayantha Nethsara",
    email: "nayantha@example.com",
    role: "Software Engineer",
    avatarUrl: "/avatar.png",
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
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={user.name} readOnly className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly className="mt-1" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user.role} readOnly className="mt-1" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="default">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
