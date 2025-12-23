import { v4 as uuidv4 } from "uuid";
import type { DeckTag } from "shared";

// Card types
export interface TextCard {
  id: string;
  question: string;
  answer: string;
  cardType?: "text";
  explanation?: string;
  imageUrl?: string;
  researchUrl?: string;
}

export interface MultipleChoiceCard {
  id: string;
  question: string;
  answer: string;
  cardType: "multiple-choice";
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  imageUrl?: string;
  researchUrl?: string;
}

export type Card = TextCard | MultipleChoiceCard;

export interface SeedDeck {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: DeckTag[];
  isPublic: string;
  views: number;
  createdAt: string;
  lastModified: number;
  cards: Card[];
}

// Options for card creation
interface CardOptions {
  explanation?: string;
  imageUrl?: string;
  researchUrl?: string;
}

// Helper to create a text card
export const textCard = (
  question: string,
  answer: string,
  options?: string | CardOptions // Can be just explanation string for backwards compat
): TextCard => {
  const opts = typeof options === "string" ? { explanation: options } : options || {};
  return {
    id: uuidv4(),
    question,
    answer,
    ...(opts.explanation && { explanation: opts.explanation }),
    ...(opts.imageUrl && { imageUrl: opts.imageUrl }),
    ...(opts.researchUrl && { researchUrl: opts.researchUrl }),
  };
};

// Helper to create a multiple choice card
export const mcCard = (
  question: string,
  choices: [string, string, string],
  correctIndex: 0 | 1 | 2,
  options?: string | CardOptions // Can be just explanation string for backwards compat
): MultipleChoiceCard => {
  const opts = typeof options === "string" ? { explanation: options } : options || {};
  return {
    id: uuidv4(),
    question,
    answer: choices[correctIndex],
    cardType: "multiple-choice",
    options: choices,
    correctOptionIndex: correctIndex,
    ...(opts.explanation && { explanation: opts.explanation }),
    ...(opts.imageUrl && { imageUrl: opts.imageUrl }),
    ...(opts.researchUrl && { researchUrl: opts.researchUrl }),
  };
};

// Helper to create a deck with tags
export const createDeck = (
  title: string,
  description: string,
  tags: DeckTag[],
  cards: Card[],
  views: number = 0
): SeedDeck => ({
  id: uuidv4(),
  userId: "system",
  title,
  description,
  tags,
  isPublic: "true",
  views,
  createdAt: new Date().toISOString(),
  lastModified: Date.now(),
  cards,
});
