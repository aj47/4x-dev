"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import AppTile from "@/components/AppTile";
import CodePreviewPanel from "@/components/CodePreviewPanel";
import { BrowserContainer } from "@/components/ui/browser-container";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import PromptInput from "@/components/DevTools/PromptInput";
import PerformanceMetrics from "@/components/DevTools/PerformanceMetrics";
import VoiceInput from "@/components/DevTools/VoiceInput";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
  gap: 20px;
  color: #9ca3af;
`;

const LoadingTitle = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
`;

const LoadingBar = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  height: 8px;
  background: rgba(75, 85, 99, 0.3);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const LoadingProgress = styled(motion.div)`
  height: 100%;
  background: #4b5563;
  border-radius: 4px;
`;

const ShortLoadingBar = styled(LoadingBar)`
  max-width: 300px;
`;

export default function Results() {
  const searchParams = useSearchParams();
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    new Array(5).fill(true)
  );
  const [results, setResults] = useState<string[]>(new Array(5).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [selectedAppIndex, setSelectedAppIndex] = useState(0);
  const [editedResults, setEditedResults] = useState<string[]>(
    new Array(5).fill("")
  );
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [generationTimes, setGenerationTimes] = useState<{
    [key: number]: number;
  }>({});
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const { theme } = useTheme();

  const variations = [
    "",
    "Make it visually appealing and use a different framework than the other versions.",
    "Focus on simplicity and performance. Use minimal dependencies.",
    "Add some creative features that might not be explicitly mentioned in the prompt.",
    "Create an enhanced version with additional features and modern design patterns.",
  ];

  const appTitles = [
    "Standard Version",
    "Visual Focus",
    "Minimalist Version",
    "Creative Approach",
    "Enhanced Version",
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "l":
            e.preventDefault();
            setIsPromptOpen((prev) => !prev);
            break;
          case "p":
          case "x":
            e.preventDefault();
            setIsMetricsOpen((prev) => !prev);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const generateApp = async (index: number, promptText: string) => {
    const startTime = performance.now();
    try {
      const framework =
        appTitles[index] === "Standard Version"
          ? "bootstrap"
          : appTitles[index] === "Visual Focus"
          ? "materialize"
          : appTitles[index] === "Minimalist Version"
          ? "pure"
          : appTitles[index] === "Creative Approach"
          ? "tailwind"
          : "Bulma";

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          variation: variations[index],
          framework,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate app ${index + 1}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResults((prev) => {
        const newResults = [...prev];
        newResults[index] = data.code;
        return newResults;
      });

      setEditedResults((prev) => {
        const newResults = [...prev];
        newResults[index] = data.code;
        return newResults;
      });

      const endTime = performance.now();
      setGenerationTimes((prev) => ({
        ...prev,
        [index]: (endTime - startTime) / 1000, // Convert to seconds
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate applications"
      );
    } finally {
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });
    }
  };

  const handleNewPrompt = async (prompt: string, isUpdate: boolean = false) => {
    if (isUpdate) {
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[selectedAppIndex] = true;
        return newStates;
      });

      try {
        const framework =
          appTitles[selectedAppIndex] === "Standard Version"
            ? "bootstrap"
            : appTitles[selectedAppIndex] === "Visual Focus"
            ? "materialize"
            : appTitles[selectedAppIndex] === "Minimalist Version"
            ? "pure"
            : appTitles[selectedAppIndex] === "Creative Approach"
            ? "tailwind"
            : "Bulma";

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            existingCode: editedResults[selectedAppIndex],
            framework,
            isUpdate: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update app ${selectedAppIndex + 1}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setEditedResults((prev) => {
          const newResults = [...prev];
          newResults[selectedAppIndex] = data.code;
          return newResults;
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update application"
        );
      } finally {
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[selectedAppIndex] = false;
          return newStates;
        });
      }
    } else {
      setLoadingStates(new Array(5).fill(true));
      setResults(new Array(5).fill(""));
      setEditedResults(new Array(5).fill(""));
      setGenerationTimes({});
      Promise.all(variations.map((_, index) => generateApp(index, prompt)));
    }
  };

  const handleVoiceInput = (text: string) => {
    handleNewPrompt(text, true);
  };

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (!prompt) {
      setError("No prompt provided");
      setLoadingStates(new Array(5).fill(false));
      return;
    }

    // Generate all apps in parallel
    Promise.all(variations.map((_, index) => generateApp(index, prompt)));
  }, [searchParams]);

  const handleCodeChange = (newCode: string) => {
    const newResults = [...editedResults];
    newResults[selectedAppIndex] = newCode;
    setEditedResults(newResults);
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full h-screen p-6 pb-20 md:p-8 ${
          theme === "dark" ? "bg-gray-900" : ""
        }`}
      >
        <div
          className={`max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col ${
            theme === "light" ? "backdrop-blur-sm" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xl ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 ">
                10x.Dev
              </span>
            </motion.h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                className={`hover:underline transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ← Back to Prompt
              </Link>
            </div>

            {/* <ThemeToggle /> */}
          </div>

          {error && (
            <div
              className={`p-4 rounded-lg ${
                theme === "dark" ? "bg-red-900/20" : "bg-red-50"
              }`}
            >
              <p
                className={`text-center ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {error}
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-10rem)]">
              {/* Left side - App tiles */}
              <div className="lg:w-1/4 flex flex-col gap-4 h-full overflow-y-auto pr-2">
                {appTitles.map((title, index) => (
                  <AppTile
                    key={title}
                    title={title}
                    isSelected={selectedAppIndex === index}
                    onClick={() => setSelectedAppIndex(index)}
                    isLoading={loadingStates[index]}
                    theme={theme}
                  />
                ))}
              </div>

              {/* Right side - Code preview panel */}
              <motion.div
                className="lg:w-3/4 h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="h-full ">
                  <BrowserContainer theme={theme}>
                    {loadingStates[selectedAppIndex] ? (
                      <LoadingContainer>
                        <LoadingTitle>Generating</LoadingTitle>
                        <LoadingBar>
                          <LoadingProgress
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "linear",
                            }}
                          />
                        </LoadingBar>
                        <ShortLoadingBar>
                          <LoadingProgress
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "linear",
                              delay: 0.2,
                            }}
                          />
                        </ShortLoadingBar>
                      </LoadingContainer>
                    ) : (
                      <CodePreviewPanel
                        code={editedResults[selectedAppIndex] || ""}
                        onChange={handleCodeChange}
                        isLoading={loadingStates[selectedAppIndex]}
                        theme={theme}
                      />
                    )}
                  </BrowserContainer>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
      <PromptInput
        isOpen={isPromptOpen}
        onSubmit={handleNewPrompt}
        isUpdateMode={true}
        currentCode={editedResults[selectedAppIndex]}
      />
      <PerformanceMetrics
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        generationTimes={generationTimes}
      />
      {isVoiceEnabled && (
        <VoiceInput onInput={(text) => handleVoiceInput(text)} theme={theme} />
      )}
    </AuroraBackground>
  );
}
