import { z } from "zod";
import type { Card, DeckTag } from "shared";

// Card type enum
export const CardTypeSchema = z.enum(['text', 'multiple-choice']).default('text');

// Card schema - validates API response matches gqlTypes.Card
// Using nullish() to match GraphQL Maybe<T> which can be T | null | undefined
export const CardSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  cardType: z.string().nullish(),
  options: z.array(z.string()).nullish(),
  correctOptionIndex: z.number().min(0).max(2).nullish(),
  explanation: z.string().nullish(),
  imageUrl: z.string().nullish(),
  researchUrl: z.string().nullish(),
}) satisfies z.ZodType<Card>;

// Tag schema - matches DeckTag from shared
export const DeckTagSchema = z.enum([
  // Driving & Licensing
  'driving',
  'car-license',
  'motorcycle-license',
  'truck-license',
  'learners-permit',
  'licensing',
  // IT & Tech
  'it',
  'it-certifications',
  'aws',
  'azure',
  'cybersecurity',
  'networking',
  'cloud-computing',
  'programming',
  // Workplace
  'workplace-safety',
  'forklift',
  'osha',
  'whs',
  // Languages
  'languages',
  'spanish',
  'japanese',
  'french',
  'german',
  'chinese',
  // Academic
  'science',
  'math',
  'history',
  'geography',
  'medical',
  'nursing',
  'business',
  // General
  'test-prep',
  'certification',
  'australia',
  'usa',
  'uk',
  'other',
]) satisfies z.ZodType<DeckTag>;

// Base deck fields shared between summary and detail
const DeckBaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  tags: z.array(DeckTagSchema).nullish(),
  isPublic: z.boolean(),
  createdAt: z.string(),
  lastModified: z.number(),
});

/**
 * DeckSummary - returned by listing queries (publicDecks, myDecks, searchPublicDecks)
 * Contains cardCount for display but NOT the full cards array
 */
export const DeckSummarySchema = DeckBaseSchema.extend({
  cardCount: z.number(),
  views: z.number().optional(),
});
export type DeckSummary = z.infer<typeof DeckSummarySchema>;

/**
 * DeckDetail - returned by getDeck query and mutations
 * Contains the full cards array for editing/viewing
 */
export const DeckDetailSchema = DeckBaseSchema.extend({
  cards: z.array(CardSchema),
});
export type DeckDetail = z.infer<typeof DeckDetailSchema>;

// Legacy schema for backwards compatibility (local storage may have either format)
export const DeckSchema = DeckBaseSchema.extend({
  cards: z.array(CardSchema).optional(),
  cardCount: z.number().optional(),
});
export type FrontendDeck = z.infer<typeof DeckSchema>;

// SyncResult schema
export const SyncResultSchema = z.object({
  success: z.boolean(),
  syncedCount: z.number(),
});

// Form validation schemas for React Hook Form
export const CreateDeckInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isPublic: z.boolean().optional().default(false),
});

export const CardInputSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  cardType: CardTypeSchema.optional(),
  options: z.array(z.string().min(1, "Option cannot be empty")).length(3).optional(),
  correctOptionIndex: z.number().min(0).max(2).optional(),
  explanation: z.string().optional(),
}).refine(
  (data) => {
    // If multiple choice, options and correctOptionIndex are required
    if (data.cardType === 'multiple-choice') {
      return data.options && data.options.length === 3 && data.correctOptionIndex !== undefined;
    }
    return true;
  },
  { message: "Multiple choice cards require 3 options and a correct answer selection" }
);

export const UpdateCardInputSchema = z.object({
  question: z.string().min(1, "Question is required").optional(),
  answer: z.string().min(1, "Answer is required").optional(),
  cardType: CardTypeSchema.optional(),
  options: z.array(z.string()).optional(),
  correctOptionIndex: z.number().min(0).max(2).optional(),
  explanation: z.string().optional(),
});

// Infer types from form schemas
export type CreateDeckFormData = z.infer<typeof CreateDeckInputSchema>;
export type CardFormData = z.infer<typeof CardInputSchema>;
export type UpdateCardFormData = z.infer<typeof UpdateCardInputSchema>;
