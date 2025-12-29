import { v4 as uuidv4 } from "uuid";
import type { DeckTag } from "../../../../shared/src";

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
  researchUrl?: string;
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

// Options for deck creation
interface DeckOptions {
  views?: number;
  researchUrl?: string;
}

// Helper to create a deck with a hardcoded stable ID
export const createDeck = (
  id: string,
  title: string,
  description: string,
  tags: DeckTag[],
  cards: Card[],
  options?: number | DeckOptions // Can be just views for backwards compat
): SeedDeck => {
  const opts = typeof options === "number" ? { views: options } : options || {};
  return {
    id,
    userId: "system",
    title,
    description,
    tags,
    isPublic: "true",
    views: opts.views ?? 0,
    createdAt: new Date().toISOString(),
    lastModified: Date.now(),
    cards,
    ...(opts.researchUrl && { researchUrl: opts.researchUrl }),
  };
};
