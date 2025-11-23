import type { AboutResponse } from "../../types/about";

import { ABOUT_STORAGE_KEY } from "../../constants/storage";
import { isBrowser } from "../isBrowser";

export function loadLatestAbout(): AboutResponse | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(ABOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.about === "string"
    ) {
      return parsed as AboutResponse;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLatestAbout(data: AboutResponse): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Do nothing
  }
}
