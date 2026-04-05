"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, ChevronDown } from "lucide-react";

export default function SupportPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const faqs = [
    {
      question: "How do I use AR?",
      answer: "Download the AR app from our platform, then scan the provided AR images with your device camera to see 3D math models come to life."
    },
    {
      question: "How does the AI math solver work?",
      answer: "Our AI analyzes your math problems using advanced algorithms. Simply type or upload an image of your problem, and the AI will provide step-by-step solutions."
    },
    {
      question: "Can I track my progress?",
      answer: "Yes! Visit your Profile page to see statistics on problems solved, AR models viewed, and achievements earned."
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Help & Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAQ Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-800 pb-4 last:border-0">
                  <button className="flex w-full items-center justify-between text-left">
                    <span className="text-white font-medium">{faq.question}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                  <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-white">Contact Us</h2>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-green-500 focus:outline-none resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="text-sm text-green-500 text-center">
                  Message sent successfully! We&apos;ll get back to you soon.
                </p>
              )}

              {status === "error" && (
                <p className="text-sm text-red-500 text-center">
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
