"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const messages = [
  { text: "Brewing code magic...", emoji: "✨" },
  { text: "Wrangling bits and bytes...", emoji: "🤖" },
  { text: "Connecting neural pathways...", emoji: "🧠" },
  { text: "Summoning digital minions...", emoji: "👾" },
  { text: "Generating documentation...", emoji: "📚" },
  { text: "Polishing pixels...", emoji: "💎" },
  { text: "Tuning the flux capacitor...", emoji: "⚡" },
  { text: "Teaching AI new tricks...", emoji: "🐕" },
  { text: "Bending reality...", emoji: "🌀" },
];

const LoadingScreen = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const router = useRouter();

  useEffect(() => {

    const wait = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(wait);

  }, [router]);

  useEffect(() => {
    // Set up message change animation
    const intervalId = setInterval(() => {
      setFadeState("out"); // Start fade-out
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setFadeState("in"); // Fade-in new message
      }, 500);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed inset-0 z-50 bg-[#f8f9fe] flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <div className="w-16 h-16 mb-12 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#F97316] flex items-center justify-center">
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
        </div>
      </div>

      {/* Visual elements */}
      <div className="relative w-32 h-32 mb-10">
        {/* Spinning gradient orb */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#F97316] animate-spin opacity-75 blur-sm"></div>

        {/* Center pulse */}
        <div className="absolute inset-8 rounded-full bg-white animate-pulse"></div>

        {/* Current emoji */}
        <div
          className={`absolute inset-0 flex items-center justify-center text-3xl transition-opacity duration-500 ${
            fadeState === "out" ? "opacity-0" : "opacity-100"
          }`}
        >
          {messages[currentMessageIndex].emoji}
        </div>
      </div>

      {/* Text message */}
      <div className="h-8 mb-8 flex items-center justify-center">
        <p
          className={`text-gray-700 text-xl font-medium transition-opacity duration-500 ${
            fadeState === "out" ? "opacity-0" : "opacity-100"
          }`}
        >
          {messages[currentMessageIndex].text}
        </p>
      </div>

      {/* Loading spinner */}
      <Loader2 className="h-8 w-8 text-[#4263EB] animate-spin" />

      {/* Decorative elements */}
      <div className="fixed top-40 left-40 w-64 h-64 bg-[#0EA5E9] rounded-full blur-[120px] opacity-10 animate-pulse"></div>
      <div className="fixed bottom-40 right-40 w-64 h-64 bg-[#F97316] rounded-full blur-[120px] opacity-10 animate-pulse"></div>
    </div>
  );
};

export default LoadingScreen;
