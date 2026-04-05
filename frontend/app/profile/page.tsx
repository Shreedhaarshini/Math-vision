import { User, Mail, GraduationCap, Target, Eye, Trophy } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Profile Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          {/* Avatar and Info */}
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-900/30">
              <span className="text-3xl font-bold text-green-500">S</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Shree</h1>
            <div className="mt-2 flex items-center gap-2 text-slate-400">
              <Mail className="h-4 w-4" />
              <span>shree@student.com</span>
            </div>
            <span className="mt-3 rounded-full border border-green-500/50 px-3 py-1 text-sm text-green-500">
              Student
            </span>
          </div>

          {/* Divider */}
          <div className="my-8 border-b border-slate-800"></div>

          {/* Statistics */}
          <h2 className="mb-4 text-lg font-semibold text-white">Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-center">
              <Target className="mx-auto h-5 w-5 text-green-500" />
              <p className="mt-2 text-2xl font-bold text-white">42</p>
              <p className="text-sm text-slate-400">Problems Solved</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-center">
              <Eye className="mx-auto h-5 w-5 text-green-500" />
              <p className="mt-2 text-2xl font-bold text-white">12</p>
              <p className="text-sm text-slate-400">AR Models Viewed</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-center">
              <Trophy className="mx-auto h-5 w-5 text-green-500" />
              <p className="mt-2 text-2xl font-bold text-white">8</p>
              <p className="text-sm text-slate-400">Achievements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
