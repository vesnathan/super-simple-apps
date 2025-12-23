// Re-export all types from generated GraphQL types
export type {
  Card,
  CardInput,
  CreateDeckInput,
  Deck,
  SyncDeckInput,
  SyncResult,
  UpdateCardInput,
  Query,
  Mutation,
} from "./types/gqlTypes";

// CardType is a string literal union for card types
export type CardType = "text" | "multiple-choice";

// Predefined tag categories for deck organization
export type DeckTag =
  // Driving & Licensing
  | 'driving'
  | 'car-license'
  | 'motorcycle-license'
  | 'truck-license'
  | 'learners-permit'
  | 'licensing'
  // IT & Tech
  | 'it'
  | 'it-certifications'
  | 'aws'
  | 'azure'
  | 'cybersecurity'
  | 'networking'
  | 'cloud-computing'
  | 'programming'
  // Workplace
  | 'workplace-safety'
  | 'forklift'
  | 'osha'
  | 'whs'
  // Languages
  | 'languages'
  | 'spanish'
  | 'japanese'
  | 'french'
  | 'german'
  | 'chinese'
  // Academic
  | 'science'
  | 'math'
  | 'history'
  | 'geography'
  | 'medical'
  | 'nursing'
  | 'business'
  // General
  | 'test-prep'
  | 'certification'
  | 'australia'
  | 'usa'
  | 'uk'
  | 'other';

export const DECK_TAGS: { value: DeckTag; label: string }[] = [
  // Driving & Licensing
  { value: 'driving', label: 'Driving' },
  { value: 'car-license', label: 'Car License' },
  { value: 'motorcycle-license', label: 'Motorcycle License' },
  { value: 'truck-license', label: 'Truck License' },
  { value: 'learners-permit', label: 'Learners Permit' },
  { value: 'licensing', label: 'Licensing' },
  // IT & Tech
  { value: 'it', label: 'IT' },
  { value: 'it-certifications', label: 'IT Certifications' },
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'networking', label: 'Networking' },
  { value: 'cloud-computing', label: 'Cloud Computing' },
  { value: 'programming', label: 'Programming' },
  // Workplace
  { value: 'workplace-safety', label: 'Workplace Safety' },
  { value: 'forklift', label: 'Forklift' },
  { value: 'osha', label: 'OSHA' },
  { value: 'whs', label: 'WHS' },
  // Languages
  { value: 'languages', label: 'Languages' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'chinese', label: 'Chinese' },
  // Academic
  { value: 'science', label: 'Science' },
  { value: 'math', label: 'Math' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'medical', label: 'Medical' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'business', label: 'Business' },
  // General
  { value: 'test-prep', label: 'Test Prep' },
  { value: 'certification', label: 'Certification' },
  { value: 'australia', label: 'Australia' },
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'UK' },
  { value: 'other', label: 'Other' },
];
