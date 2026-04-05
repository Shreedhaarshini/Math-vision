"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Settings, HelpCircle, LogOut } from "lucide-react";

export function UserProfileDropdown() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Loading state
  if (status === "loading") {
    return (
      <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
    );
  }

  // Get user data from session or use default
  const user = session?.user || {
    name: "Guest",
    email: "guest@example.com",
    role: "Student",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = () => {
    if (session) {
      signOut({ callbackUrl: "/login" });
    } else {
      router.push("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-green-900/30 hover:bg-green-900/50"
        >
          <span className="text-green-500 font-semibold text-sm">
            {getInitials(user.name || "Guest")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-slate-900 border-slate-800 text-slate-100"
        align="end"
        forceMount
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
            <Badge
              variant="outline"
              className="w-fit mt-2 border-green-500/50 text-green-500 text-xs"
            >
              {(user as any).role || "Student"}
            </Badge>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-800" />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onSelect={() => router.push('/profile')}
            className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
          >
            <User className="mr-2 h-4 w-4 text-slate-400" />
            <span>View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => router.push('/messages')}
            className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
          >
            <Mail className="mr-2 h-4 w-4 text-slate-400" />
            <span>Messages</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => router.push('/settings')}
            className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => router.push('/support')}
            className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4 text-slate-400" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-800" />

        {/* Sign Out / Log In */}
        <DropdownMenuItem
          onSelect={session ? handleSignOut : () => signIn()}
          className="text-red-500 focus:bg-slate-800 focus:text-red-400 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{session ? "Sign out" : "Log in"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
