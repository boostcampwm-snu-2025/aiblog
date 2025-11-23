import { useState, useCallback } from "react";

export type PRContext = {
  repoUrl: string;
  prNumber: number;
};

export type UseModalStateReturn = {
  isOpen: boolean;
  currentPR: PRContext | null;
  open: (repoUrl: string, prNumber: number) => void;
  close: () => void;
};

/**
 * Hook for managing modal open/close state and current PR context
 * Simple state management without complex business logic
 * 
 * @returns {UseModalStateReturn} Modal state and control functions
 * 
 * @example
 * ```tsx
 * const modal = useModalState();
 * modal.open('https://github.com/owner/repo', 123);
 * // ... later
 * modal.close();
 * ```
 */
export function useModalState(): UseModalStateReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPR, setCurrentPR] = useState<PRContext | null>(null);

  const open = useCallback((repoUrl: string, prNumber: number) => {
    setCurrentPR({ repoUrl, prNumber });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setCurrentPR(null);
  }, []);

  return {
    isOpen,
    currentPR,
    open,
    close,
  };
}

