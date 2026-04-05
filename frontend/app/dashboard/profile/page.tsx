"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  School, 
  Phone, 
  BookOpen, 
  Settings, 
  Bell, 
  Moon,
  LogOut,
  Save,
  Camera
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  grade: string;
  school: string;
  phone: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  stats: {
    problemsSolved: number;
    streakDays: number;
    totalPoints: number;
    joinedDate: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage("");
    
    try {
      const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          bio: user.bio,
          grade: user.grade,
          school: user.school,
          phone: user.phone,
          avatar: user.avatar,
        }),
      });
      
      if (res.ok) {
        setMessage("Profile updated successfully!");
        // Update localStorage
        localStorage.setItem("user", JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
        }));
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account settings and preferences</p>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="general" className="gap-2">
            <User className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Profile Information</CardTitle>
              <CardDescription className="text-slate-400">
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-green-900/30 text-green-500 text-2xl font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="gap-2 border-slate-700 text-slate-300">
                    <Camera className="w-4 h-4" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300">
                    Role
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="role"
                      value={user.role}
                      disabled
                      className="bg-slate-800 border-slate-700 text-slate-400"
                    />
                    <Badge variant="outline" className="border-green-500/50 text-green-500">
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-slate-300">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Grade/Class
                  </Label>
                  <Input
                    id="grade"
                    value={user.grade}
                    onChange={(e) => setUser({ ...user, grade: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school" className="text-slate-300">
                    <School className="w-4 h-4 inline mr-2" />
                    School
                  </Label>
                  <Input
                    id="school"
                    value={user.school}
                    onChange={(e) => setUser({ ...user, school: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                <textarea
                  id="bio"
                  rows={3}
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 rounded-md bg-slate-800 border border-slate-700 text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                {message && (
                  <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Preferences</CardTitle>
              <CardDescription className="text-slate-400">
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-200 font-medium">Notifications</p>
                    <p className="text-slate-500 text-sm">Receive email and push notifications</p>
                  </div>
                </div>
                <Switch
                  checked={user.preferences.notifications}
                  onCheckedChange={(checked) => 
                    setUser({ 
                      ...user, 
                      preferences: { ...user.preferences, notifications: checked } 
                    })
                  }
                />
              </div>

              <Separator className="bg-slate-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-200 font-medium">Dark Mode</p>
                    <p className="text-slate-500 text-sm">Use dark theme throughout the app</p>
                  </div>
                </div>
                <Switch
                  checked={user.preferences.darkMode}
                  onCheckedChange={(checked) => 
                    setUser({ 
                      ...user, 
                      preferences: { ...user.preferences, darkMode: checked } 
                    })
                  }
                />
              </div>

              <Separator className="bg-slate-800" />

              <div className="space-y-2">
                <Label htmlFor="language" className="text-slate-300">Language</Label>
                <select
                  id="language"
                  value={user.preferences.language}
                  onChange={(e) => 
                    setUser({ 
                      ...user, 
                      preferences: { ...user.preferences, language: e.target.value } 
                    })
                  }
                  className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-400">Problems Solved</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-100">{user.stats.problemsSolved}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-400">Streak Days</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-100">{user.stats.streakDays}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-400">Total Points</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-100">{user.stats.totalPoints}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Member Since</span>
                <span className="text-slate-200">
                  {new Date(user.stats.joinedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID</span>
                <span className="text-slate-200 font-mono">{user.id}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
