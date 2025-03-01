"use client";

import { motion } from "framer-motion";
import {
  FaBootstrap,
  FaWind,
  FaLeaf,
  FaPalette,
  FaShieldAlt,
  FaCode,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface AppTileProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  isLoading?: boolean;
  theme: "light" | "dark";
}

interface FrameworkInfo {
  icon: IconType;
  description: string;
  rightIcon: IconType;
  framework: string;
  iconColor: string;
}

const frameworkMap: Record<string, FrameworkInfo> = {
  "Standard Version": {
    icon: FaBootstrap,
    description: "Built with Bootstrap for robust, responsive design",
    rightIcon: FaCode,
    framework: "bootstrap",
    iconColor: "#7952b3",
  },
  "Visual Focus": {
    icon: FaPalette,
    description: "Using Materialize for beautiful Material Design",
    rightIcon: FaCode,
    framework: "materialize",
    iconColor: "#eb7077",
  },
  "Minimalist Version": {
    icon: FaLeaf,
    description: "Pure CSS for lightweight, clean aesthetics",
    rightIcon: FaCode,
    framework: "pure",
    iconColor: "#3cb371",
  },
  "Creative Approach": {
    icon: FaWind,
    description: "Powered by Tailwind CSS for modern utility-first design",
    rightIcon: FaCode,
    framework: "tailwind",
    iconColor: "#38bdf8",
  },
  "Enhanced Version": {
    icon: FaShieldAlt,
    description: "Enterprise-ready with PatternFly components",
    rightIcon: FaCode,
    framework: "patternfly",
    iconColor: "#06c",
  },
};

export default function AppTile({
  title,
  isSelected,
  onClick,
  isLoading,
  theme,
}: AppTileProps) {
  const framework = frameworkMap[title];
  const LeftIcon = framework.icon;
  const RightIcon = framework.rightIcon;

  const getBgColor = () => {
    if (isSelected) {
      return "bg-[#2563EB] shadow-lg shadow-blue-500/20";
    }
    return theme === "dark"
      ? "bg-gray-800 hover:bg-gray-700"
      : "bg-white hover:bg-gray-50 border border-gray-200";
  };

  return (
    <motion.div
      onClick={onClick}
      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${getBgColor()}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow: isSelected
          ? "0 8px 24px rgba(37, 99, 235, 0.15)"
          : "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <LeftIcon
            className="w-6 h-6"
            style={{ color: isSelected ? '#ffffff' : framework.iconColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              isSelected
                ? "text-white"
                : theme === "dark"
                ? "text-gray-100"
                : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm ${
              isSelected
                ? "text-blue-50"
                : theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            {framework.description}
          </p>
          {isLoading && (
            <div className="mt-2">
              <motion.div
                className={`h-1 w-full rounded-full ${
                  isSelected ? "bg-blue-400" : "bg-blue-200"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <RightIcon
            className={`w-5 h-5 ${
              isSelected
                ? "text-white"
                : theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          />
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
}
