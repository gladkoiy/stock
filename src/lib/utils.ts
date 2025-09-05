import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate random number for card parameter
function generateRandomCard(): string {
  return Math.floor(Math.random() * 999999999 + 100000000).toString()
}

// Generate random UUID for lui parameter
function generateRandomLui(): string {
  return crypto.randomUUID()
}

// Generate promo site URL with random parameters
export function generatePromoUrl(promotionId: string): string {
  const card = generateRandomCard()
  const lui = generateRandomLui()
  return `https://promo.komandor-stock.ru/?promo_id=${promotionId}&card=${card}&lui=${lui}`
}
