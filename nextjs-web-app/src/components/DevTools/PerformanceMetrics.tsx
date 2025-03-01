"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaKeyboard, FaTimes, FaChartLine } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

interface PerformanceMetricsProps {
  isOpen: boolean;
  onClose: () => void;
  generationTimes: { [key: number]: number };
}

const frameworkNames = [
  "Material UI",
  "Chakra UI",
  "CSS Modules",
  "Styled Components"
];

export default function PerformanceMetrics({
  isOpen,
  onClose,
  generationTimes,
}: PerformanceMetricsProps) {
  const { theme } = useTheme();
  const times = Object.values(generationTimes);
  const averageTime =
    times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed top-0 right-0 bottom-0 w-80 backdrop-blur-xl border-l-2 shadow-2xl overflow-hidden z-50 ${
            theme === "dark"
              ? "bg-gray-900/40 border-gray-700/50"
              : "bg-white/80 border-gray-200/50"
          }`}
        >
          <div className="relative">
            {theme === "dark" && (
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
            )}
          </div>
          <div className="h-full flex flex-col relative">
            <div
              className={`flex items-center justify-between p-4 border-b-2 ${
                theme === "dark"
                  ? "bg-gray-900/40 border-gray-700/50"
                  : "bg-white/80 border-gray-200/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaChartLine className={theme === "dark" ? "text-blue-400" : "text-blue-500"} />
                <h2 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Performance Metrics
                </h2>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaKeyboard className="w-3 h-3" />
                  <span className="font-mono">Shift + P</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Average Generation Time */}
              <div
                className={`p-3 rounded-lg border-2 backdrop-blur-xl ${
                  theme === "dark"
                    ? "bg-gray-900/40 border-gray-700/50"
                    : "bg-white/80 border-gray-200/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Average Generation Time
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {averageTime.toFixed(2)}s
                  </span>
                </div>
              </div>

              {/* Individual Times */}
              <div className="space-y-2">
                <h3
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Individual Generation Times
                </h3>
                {Object.entries(generationTimes).map(([index, time]) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 backdrop-blur-xl ${
                      theme === "dark"
                        ? "bg-gray-900/40 border-gray-700/50"
                        : "bg-white/80 border-gray-200/50"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Version {parseInt(index) + 1}
                        </span>
                        <span
                          className={`font-mono text-xs ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {time.toFixed(2)}s
                        </span>
                      </div>
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {frameworkNames[parseInt(index)]}
                      </span>
                      <div className="relative h-1.5 bg-gray-800/20 rounded-full overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(time / Math.max(...times)) * 100}%`,
                          }}
                          transition={{ duration: 0.5 }}
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-blue-500/70 to-purple-500/70"
                              : "bg-blue-500/50"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
