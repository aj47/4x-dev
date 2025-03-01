"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaKeyboard, FaMicrophone } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useAtom } from 'jotai';
import { isPromptOpenAtom } from "@/components/KeyboardShortcuts";

interface PromptInputProps {
  isOpen: boolean;
  onSubmit: (prompt: string) => void;
}

export default function PromptInput({ isOpen, onSubmit }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const { theme } = useTheme();
  const [isPromptOpen] = useAtom(isPromptOpenAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  return (
    <AnimatePresence>
      {(isOpen || isPromptOpen) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[600px] z-50"
        >
          <div className="relative">
            <div className="absolute -top-6 left-2 flex items-center gap-2 text-gray-400 text-xs">
              <FaKeyboard className="w-3 h-3" />
              <span className="font-mono">Shift + L</span>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <FaMicrophone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your prompt..."
                  className={`w-full backdrop-blur-xl border-2 rounded-lg pl-10 pr-4 py-2.5 text-sm shadow-xl transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-900/40 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20'
                      : 'bg-white/80 border-gray-200/50 text-gray-900 placeholder-gray-400 focus:border-blue-500/30 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-2`}
                  autoFocus
                />
                <div
                  className={`absolute inset-0 rounded-lg ${
                    theme === 'dark' ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10' : ''
                  } pointer-events-none`}
                />
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
