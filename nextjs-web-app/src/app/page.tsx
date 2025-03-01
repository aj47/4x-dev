"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const examples = [
    {
      prompt: "A minimalist note-taking app with markdown support and tags",
      icon: "",
      label: "Note App",
    },
    {
      prompt: "A task management app with drag-and-drop kanban board",
      icon: "",
      label: "Kanban Board",
    },
    {
      prompt: "A weather dashboard with 5-day forecast and location search",
      icon: "",
      label: "Weather App",
    },
    {
      prompt: "A recipe manager with ingredient search and meal planning",
      icon: "",
      label: "Recipe Manager",
    },
  ];
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!prompt) {
      setError("Please enter a prompt to generate web applications.");
      return;
    }

    setError(null);
    setIsLoading(true);
    router.push(`/results?prompt=${encodeURIComponent(prompt)}`);
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10">
        <HeroGeometric badge="5x.Dev" title1="Build 10x " title2="Faster Apps">
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative bg-[#1a1f2e]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-[#2a3040] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
              <div className="relative p-6 z-10">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A to-do list app with local storage and dark mode"
                  className="w-full h-32 p-4 bg-[#1a1f2e]/50 font-sans text-base
                         border border-[#2a3040] rounded-xl mb-4 
                         focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-transparent resize-none
                         placeholder:text-gray-400/70
                         text-gray-200"
                />

                <div className="flex flex-wrap gap-2 mb-4">
                  {examples.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(example.prompt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-[#1a1f2e]/50 border border-[#2a3040] text-sm text-gray-300
                             hover:border-[#3b82f6]/50 transition-colors"
                    >
                      {example.icon}
                      {example.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#3b82f6]/90
                         text-white font-medium tracking-wide
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
                >
                  Generate Web Apps +
                </button>
              </div>
            </div>
          </div>
        </HeroGeometric>
      </div>
    </div>
  );
}
