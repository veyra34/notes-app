"use client";

import React, { useState } from "react";
import { User, Lock, Bell, Moon, Sun, Settings, ShieldAlert, Sparkles, LogOut, CheckCircle2 } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, updateSettings } = useNotes();
  const router = useRouter();

  // Profile forms state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name: name,
      email: email,
      avatar: avatar,
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    
    // Simulate successful password save
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleThemeChange = (theme: "light" | "dark") => {
    updateSettings({ theme });
  };

  const handleNotificationChange = (key: "emailNotifications" | "pushNotifications", val: boolean) => {
    updateSettings({ [key]: val });
  };

  const handleDeactivate = () => {
    if (confirm("Are you absolutely sure you want to deactivate your account? All notes and settings will be permanently lost.")) {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-105 transition-colors">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Topbar />

        <main className="px-6 md:px-8 py-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-slate-450" />
                Settings Center
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your user profile, change security parameters, and toggle theme modes.
              </p>
            </div>
          </div>

          {/* Settings Tabs Selector */}
          <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-2xl shadow-sm mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">User</span> Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "security"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Lock className="w-4 h-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "preferences"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Bell className="w-4 h-4" />
              Preferences
            </button>
          </div>

          {/* --- TAB CONTENT: PROFILE --- */}
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile Information</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Update your display name, email, and choose a custom avatar photo.
                </p>
              </div>

              {profileSuccess && (
                <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 text-emerald-700 dark:text-emerald-450 p-4 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-555" />
                  Your profile details have been successfully updated!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-850/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-700"
                  />
                  <div className="flex-1 w-full flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wide">
                      Profile Avatar URL
                    </label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Enter avatar URL..."
                      className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wide">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@domain.com"
                      className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-750">
                  <button
                    type="submit"
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- TAB CONTENT: SECURITY --- */}
          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ensure your account is protected with a secure and encrypted password.
                </p>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 text-emerald-700 dark:text-emerald-450 p-4 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-555" />
                  Your password has been successfully updated!
                </div>
              )}

              <form onSubmit={handlePasswordSave} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wide">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wide">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a new password..."
                      className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wide">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password..."
                      className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-750">
                  <button
                    type="submit"
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- TAB CONTENT: PREFERENCES --- */}
          {activeTab === "preferences" && (
            <div className="flex flex-col gap-6">
              {/* Theme preference */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Theme Customization</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Select a theme mode to reduce eye strain or adjust to matching surroundings.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all text-xs font-bold ${
                      user.theme === "light"
                        ? "bg-slate-50 border-slate-900 text-slate-900 dark:bg-slate-850 dark:border-white dark:text-white ring-2 ring-slate-900/5 dark:ring-white/5"
                        : "bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    Light Theme
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all text-xs font-bold ${
                      user.theme === "dark"
                        ? "bg-slate-550 border-white text-white dark:bg-slate-850 dark:border-white ring-2 ring-white/5"
                        : "bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750"
                    }`}
                  >
                    <Moon className="w-5 h-5 text-purple-400" />
                    Dark Theme
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Choices</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Receive alert emails or push notification warnings about notes updates and categories releases.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850/60 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Email Notifications</span>
                      <span className="text-xs text-slate-550 dark:text-slate-450">Get summaries of your edits, schedules reminders, and features releases.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={user.emailNotifications}
                      onChange={(e) => handleNotificationChange("emailNotifications", e.target.checked)}
                      className="h-5 w-5 rounded-lg border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-900/10"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850/60 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Push Notifications</span>
                      <span className="text-xs text-slate-550 dark:text-slate-450">Display updates instantly inside your web browser.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={user.pushNotifications}
                      onChange={(e) => handleNotificationChange("pushNotifications", e.target.checked)}
                      className="h-5 w-5 rounded-lg border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-900/10"
                    />
                  </label>
                </div>
              </div>

              {/* Account Management (Dangerous Zone) */}
              <div className="bg-red-50/20 dark:bg-red-950/5 border border-red-200/50 dark:border-red-900/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-bold text-red-655 dark:text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    Danger Zone
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Destructive operations that cannot be undone. Please operate carefully.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-4.5 rounded-2xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-855 dark:text-slate-200">Deactivate Account</span>
                    <span className="text-xs text-slate-450 dark:text-slate-500">Deletes all local notes, folders and signs you out permanently.</span>
                  </div>
                  <button
                    onClick={handleDeactivate}
                    className="bg-red-550 hover:bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
