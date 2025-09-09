"use client";

import {
  Calendar,
  Home,
  Settings,
  Users,
  Bus,
  MapPin,
  Clock,
  BarChart3,
  Bell,
  LogOut,
  Grid3X3,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "next-auth/react";

// Citizen menu items
const citizenItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Services",
    url: "/services",
    icon: Grid3X3,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Appointments",
    url: "/dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "Queue Management",
    url: "/dashboard/queue",
    icon: Clock,
  },
  {
    title: "Locations",
    url: "/dashboard/locations",
    icon: MapPin,
  },
  {
    title: "Transport",
    url: "/dashboard/transport",
    icon: Bus,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
];

// Admin menu items
const adminItems = [
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();

  if (!session) {
    return null; // Don't render sidebar if not authenticated
  }

  const user = {
    username: session.user.userId || "Guest",
    role: session.user.role?.toUpperCase() || "CITIZEN",
  };

  // Show items based on role
  const visibleItems = user.role === "ADMIN" ? adminItems : citizenItems;

  return (
    <Sidebar
      variant="inset"
      collapsible="offcanvas"
      className="backdrop-blur-xl "
    >
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-800 dark:text-gray-200">
                  NoPolin HUB
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user.role === "ADMIN" ? "Administration" : "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-white/50 dark:hover:bg-slate-800/50 hover:backdrop-blur-sm transition-all duration-200"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <ThemeToggle />
          <SidebarMenuButton
            asChild
            className="hover:bg-white/50 dark:hover:bg-slate-800/50 hover:backdrop-blur-sm transition-all duration-200"
          >
            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              className="flex items-center gap-2 w-full text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
