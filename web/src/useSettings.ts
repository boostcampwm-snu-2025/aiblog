import { useEffect, useState } from 'react';

export type Settings = {
  language: 'ko' | 'en';
  tone: 'blog' | 'concise';
  defaultSinceDays: number;
};

const STORAGE_KEY = 'smartblog:settings';

const defaultSettings: Settings = {
  language: 'ko',
  tone: 'blog',
  defaultSinceDays: 90,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return {
        language: parsed.language ?? defaultSettings.language,
        tone: parsed.tone ?? defaultSettings.tone,
        defaultSinceDays:
          parsed.defaultSinceDays ?? defaultSettings.defaultSinceDays,
      };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  return { settings, setSettings };
}


