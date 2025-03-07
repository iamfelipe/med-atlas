import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date:
// If no more than 1 day ago, return N hours ago
// If more than 1 day ago, return the date in the format "MM/DD/YYYY"

export function formatDateToHumanReadable(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return diffHours <= 24 ? `${diffHours} hours ago` : formatDate(date);
}
