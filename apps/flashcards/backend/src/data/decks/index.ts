// Export all deck data
export { australianDriversLicense } from "./australian-drivers-license";
export { usDriversLicense } from "./us-drivers-license";
export { compTIAAPlus } from "./comptia-a-plus";
export { compTIANetworkPlus } from "./comptia-network-plus";
export { awsCloudPractitioner } from "./aws-cloud-practitioner";
export { forkliftSafety } from "./forklift-safety";
export { workplaceSafety } from "./workplace-safety";
export { spanishEssentials } from "./spanish-essentials";
export { japaneseHiragana } from "./japanese-hiragana";
export { pythonBasics } from "./python-basics";
export { gitBasics } from "./git-basics";

// Re-export types
export type { SeedDeck, Card, TextCard, MultipleChoiceCard } from "./types";
export { createDeck, textCard, mcCard } from "./types";

// Import all decks for the combined array
import { australianDriversLicense } from "./australian-drivers-license";
import { usDriversLicense } from "./us-drivers-license";
import { compTIAAPlus } from "./comptia-a-plus";
import { compTIANetworkPlus } from "./comptia-network-plus";
import { awsCloudPractitioner } from "./aws-cloud-practitioner";
import { forkliftSafety } from "./forklift-safety";
import { workplaceSafety } from "./workplace-safety";
import { spanishEssentials } from "./spanish-essentials";
import { japaneseHiragana } from "./japanese-hiragana";
import { pythonBasics } from "./python-basics";
import { gitBasics } from "./git-basics";
import type { SeedDeck } from "./types";

// View counts for seeding (to simulate popularity)
const viewCounts: Record<string, number> = {
  // Most popular - driving tests (high search volume)
  "Australian Driver's License Test": 15420,
  "US Driver's License Test (General)": 28350,
  // IT Certifications - popular for job seekers
  "AWS Cloud Practitioner": 12840,
  "CompTIA A+ Core Concepts": 9650,
  "CompTIA Network+ Essentials": 7230,
  // Workplace Safety
  "Forklift Operator Safety": 4120,
  "Workplace Safety (WHS/OSHA)": 3890,
  // Languages - very popular
  "Spanish - Essential Phrases": 18920,
  "Japanese Hiragana": 11340,
  // Programming
  "Python Programming Basics": 21560,
  "Git Version Control Basics": 16780,
};

// Add view counts to decks
const addViews = (deck: SeedDeck): SeedDeck => ({
  ...deck,
  views: viewCounts[deck.title] ?? 0,
});

// All decks combined for seeding
export const allDecks: SeedDeck[] = [
  // Driver's License
  australianDriversLicense,
  usDriversLicense,
  // IT Certifications
  compTIAAPlus,
  compTIANetworkPlus,
  awsCloudPractitioner,
  // Workplace Safety
  forkliftSafety,
  workplaceSafety,
  // Languages
  spanishEssentials,
  japaneseHiragana,
  // Programming
  pythonBasics,
  gitBasics,
].map(addViews);

// Export deck IDs for default favorites (most popular)
export const defaultFavoriteDeckTitles = [
  "US Driver's License Test (General)",
  "Python Programming Basics",
];
