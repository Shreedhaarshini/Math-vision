import { Bell, Moon, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Settings</h1>
        
        {/* Notifications Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-slate-700 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 mb-6"></div>

        {/* Appearance Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium">Dark Mode Enforced</p>
                  <p className="text-sm text-slate-400">Always use dark theme</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-slate-700 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 mb-6"></div>

        {/* Privacy Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium">Public Profile</p>
                  <p className="text-sm text-slate-400">Make your profile visible to others</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-slate-700 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
