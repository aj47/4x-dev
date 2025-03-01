'use client';

import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

// Global state atoms
export const isPromptOpenAtom = atom(false);
export const isMetricsOpenAtom = atom(false);

export default function KeyboardShortcuts() {
  const [isPromptOpen, setIsPromptOpen] = useAtom(isPromptOpenAtom);
  const [isMetricsOpen, setIsMetricsOpen] = useAtom(isMetricsOpenAtom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'l':
            e.preventDefault();
            setIsPromptOpen(prev => !prev);
            break;
          case 'p':
          case 'x':
            e.preventDefault();
            setIsMetricsOpen(prev => !prev);
            break;
        }
      }
    };

    // Add event listener to the document instead of window
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [setIsPromptOpen, setIsMetricsOpen]);

  return null;
}
