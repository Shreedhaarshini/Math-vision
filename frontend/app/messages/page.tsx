import { Bell, Mail, BookOpen } from "lucide-react";

export default function MessagesPage() {
  const messages = [
    {
      id: 1,
      icon: Bell,
      title: "Welcome to the Platform!",
      timestamp: "2 days ago",
      snippet: "Thank you for joining MathMind AI. Start exploring math concepts with our AI tutor and AR visualizations.",
      unread: true,
    },
    {
      id: 2,
      icon: BookOpen,
      title: "New Math Practice Available",
      timestamp: "1 day ago",
      snippet: "New practice problems on Algebra and Geometry have been added. Test your skills now!",
      unread: true,
    },
    {
      id: 3,
      icon: Mail,
      title: "Weekly Progress Report",
      timestamp: "5 hours ago",
      snippet: "You've solved 12 problems this week. Keep up the great work and maintain your streak!",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Messages</h1>
        
        <div className="space-y-3">
          {messages.map((message) => {
            const Icon = message.icon;
            return (
              <div
                key={message.id}
                className={`flex gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                  message.unread ? "border-l-4 border-l-green-500" : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <Icon className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-medium ${message.unread ? "text-white" : "text-slate-300"}`}>
                      {message.title}
                    </h3>
                    <span className="text-xs text-slate-500 shrink-0">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{message.snippet}</p>
                </div>
                {message.unread && (
                  <div className="ml-2 h-2 w-2 shrink-0 rounded-full bg-green-500"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
