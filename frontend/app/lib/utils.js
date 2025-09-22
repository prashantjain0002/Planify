import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncateDescription(desc, maxChars = 180) {
  if (!desc) return "";
  return desc.length > maxChars ? desc.slice(0, maxChars) + "" : desc;
}
