import { z } from "zod";
import { graphqlClient } from "@/lib/amplify";
import { PUBLIC_DECKS, MY_DECKS, SEARCH_PUBLIC_DECKS, GET_DECK, POPULAR_DECKS, GET_DECKS_BY_IDS } from "@/graphql/queries";
import { CREATE_DECK, SYNC_DECKS, UPDATE_CARD, UPDATE_DECK, DELETE_DECK, INCREMENT_DECK_VIEWS, REPORT_CARD } from "@/graphql/mutations";
import {
  DeckSummarySchema,
  DeckSummary,
  DeckDetailSchema,
  DeckDetail,
  FrontendDeck,
} from "@/schemas/deck";
import type {
  CreateDeckInput,
  SyncDeckInput,
  UpdateCardInput,
  Card,
} from "@simple-flashcards/shared";
import { generateId } from "@/utils/id";

// Type for GraphQL result with errors
interface GraphQLResult<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export const deckService = {
  /**
   * Get public decks - uses IAM auth for guest access
   * Returns DeckSummary[] (with cardCount, without full cards array)
   */
  async getPublicDecks(): Promise<DeckSummary[]> {
    const result = (await graphqlClient.graphql({
      query: PUBLIC_DECKS,
      authMode: "iam",
    })) as GraphQLResult<{ publicDecks: unknown[] }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    const decks = result.data?.publicDecks ?? [];
    return z.array(DeckSummarySchema).parse(decks);
  },

  /**
   * Search public decks with pagination
   * Uses userPool auth when logged in (to filter out user's own decks)
   * Uses IAM auth for guest access
   * Returns DeckSummary[] (with cardCount, without full cards array)
   */
  async searchPublicDecks(
    search?: string,
    limit: number = 10,
    nextToken?: string,
    isLoggedIn: boolean = false
  ): Promise<{ decks: DeckSummary[]; nextToken: string | null }> {
    // Convert empty string to undefined for cleaner API call
    const searchParam = search?.trim() || undefined;

    const result = (await graphqlClient.graphql({
      query: SEARCH_PUBLIC_DECKS,
      variables: { search: searchParam, limit, nextToken },
      // Use userPool when logged in so resolver can filter out user's own decks
      authMode: isLoggedIn ? "userPool" : "iam",
    })) as GraphQLResult<{
      searchPublicDecks: { decks: unknown[]; nextToken: string | null };
    }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    const data = result.data?.searchPublicDecks ?? { decks: [], nextToken: null };
    return {
      decks: z.array(DeckSummarySchema).parse(data.decks),
      nextToken: data.nextToken,
    };
  },

  /**
   * Get a single deck by ID
   * Uses userPool auth when logged in, IAM auth for guests
   * Returns DeckDetail (with full cards array) or null if not found
   */
  async getDeck(id: string, isLoggedIn: boolean = false): Promise<DeckDetail | null> {
    const result = (await graphqlClient.graphql({
      query: GET_DECK,
      variables: { id },
      authMode: isLoggedIn ? "userPool" : "iam",
    })) as GraphQLResult<{ getDeck: unknown | null }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    const deck = result.data?.getDeck;
    if (!deck) {
      return null;
    }

    return DeckDetailSchema.parse(deck);
  },

  /**
   * Get current user's decks - requires authentication
   * Returns DeckSummary[] (with cardCount, without full cards array)
   */
  async getMyDecks(): Promise<DeckSummary[]> {
    const result = (await graphqlClient.graphql({
      query: MY_DECKS,
      authMode: "userPool",
    })) as GraphQLResult<{ myDecks: unknown[] }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    const decks = result.data?.myDecks ?? [];
    return z.array(DeckSummarySchema).parse(decks);
  },

  /**
   * Create a new deck
   * Returns DeckDetail (with full cards array)
   */
  async createDeck(
    title: string,
    cards: Card[] = [],
    existingId?: string
  ): Promise<DeckDetail> {
    const input: CreateDeckInput = {
      id: existingId || generateId(),
      title,
      cards: cards.map((c) => ({
        id: c.id,
        question: c.question,
        answer: c.answer,
      })),
      isPublic: false,
    };

    const result = (await graphqlClient.graphql({
      query: CREATE_DECK,
      variables: { input },
      authMode: "userPool",
    })) as GraphQLResult<{ createDeck: unknown }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return DeckDetailSchema.parse(result.data?.createDeck);
  },

  /**
   * Sync multiple decks to the server
   * Accepts FrontendDeck[] (which may have cards and/or cardCount)
   */
  async syncDecks(decks: FrontendDeck[]): Promise<{ success: boolean; syncedCount: number }> {
    const syncInput: SyncDeckInput[] = decks.map((deck) => {
      // Ensure createdAt is a valid ISO string for AWSDateTime
      let createdAt: string;
      if (typeof deck.createdAt === 'number') {
        createdAt = new Date(deck.createdAt).toISOString();
      } else if (typeof deck.createdAt === 'string') {
        // Validate it's a proper ISO string, if not convert it
        const date = new Date(deck.createdAt);
        createdAt = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      } else {
        createdAt = new Date().toISOString();
      }

      return {
        id: deck.id,
        title: deck.title,
        cards: (deck.cards ?? []).map((c) => ({
          id: c.id,
          question: c.question,
          answer: c.answer,
        })),
        isPublic: deck.isPublic,
        createdAt,
        lastModified: deck.lastModified,
      };
    });

    const result = (await graphqlClient.graphql({
      query: SYNC_DECKS,
      variables: { decks: syncInput },
      authMode: "userPool",
    })) as GraphQLResult<{ syncDecks: { success: boolean; syncedCount: number } }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.syncDecks ?? { success: false, syncedCount: 0 };
  },

  /**
   * Save a single deck (wrapper around syncDecks)
   * Accepts FrontendDeck (which may have cards and/or cardCount)
   */
  async saveDeck(deck: FrontendDeck): Promise<void> {
    await this.syncDecks([deck]);
  },

  /**
   * Update a card within a deck
   * Returns DeckDetail (with full cards array)
   */
  async updateCard(
    deckId: string,
    cardId: string,
    updates: UpdateCardInput
  ): Promise<DeckDetail> {
    const result = (await graphqlClient.graphql({
      query: UPDATE_CARD,
      variables: {
        deckId,
        cardId,
        input: updates,
      },
      authMode: "userPool",
    })) as GraphQLResult<{ updateCard: unknown }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return DeckDetailSchema.parse(result.data?.updateCard);
  },

  /**
   * Alias for backwards compatibility
   * Returns DeckSummary[] (with cardCount, without full cards array)
   */
  async getUserDecks(): Promise<DeckSummary[]> {
    return this.getMyDecks();
  },

  /**
   * Get multiple decks by their IDs (for favorites)
   * Returns DeckSummary[] (with cardCount, without full cards array)
   */
  async getDecksByIds(ids: string[]): Promise<DeckSummary[]> {
    if (ids.length === 0) return [];

    const result = (await graphqlClient.graphql({
      query: GET_DECKS_BY_IDS,
      variables: { ids },
      authMode: "iam",
    })) as GraphQLResult<{ getDecksByIds: unknown[] }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    const decks = result.data?.getDecksByIds ?? [];
    return z.array(DeckSummarySchema).parse(decks);
  },

  /**
   * Get popular decks sorted by view count
   * Returns DeckSummary[] (with cardCount and views, without full cards array)
   */
  async getPopularDecks(limit: number = 10): Promise<DeckSummary[]> {
    const result = (await graphqlClient.graphql({
      query: POPULAR_DECKS,
      variables: { limit },
      authMode: "iam",
    })) as GraphQLResult<{ popularDecks: unknown[] }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    const decks = result.data?.popularDecks ?? [];
    return z.array(DeckSummarySchema).parse(decks);
  },

  /**
   * Increment view count for a deck
   */
  async incrementDeckViews(deckId: string): Promise<{ success: boolean; views: number }> {
    const result = (await graphqlClient.graphql({
      query: INCREMENT_DECK_VIEWS,
      variables: { deckId },
      authMode: "iam",
    })) as GraphQLResult<{ incrementDeckViews: { success: boolean; views: number } }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.incrementDeckViews ?? { success: false, views: 0 };
  },

  /**
   * Report a card as incorrect
   */
  async reportCard(deckId: string, cardId: string, reason: string): Promise<{ success: boolean }> {
    const result = (await graphqlClient.graphql({
      query: REPORT_CARD,
      variables: { input: { deckId, cardId, reason } },
      authMode: "iam",
    })) as GraphQLResult<{ reportCard: { success: boolean } }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.reportCard ?? { success: false };
  },

  /**
   * Update a deck's properties (title, isPublic)
   * Returns DeckDetail (with full cards array)
   */
  async updateDeck(
    deckId: string,
    updates: { title?: string; isPublic?: boolean }
  ): Promise<DeckDetail> {
    const result = (await graphqlClient.graphql({
      query: UPDATE_DECK,
      variables: {
        deckId,
        input: updates,
      },
      authMode: "userPool",
    })) as GraphQLResult<{ updateDeck: unknown }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return DeckDetailSchema.parse(result.data?.updateDeck);
  },

  /**
   * Delete a deck
   */
  async deleteDeck(deckId: string): Promise<{ success: boolean; deletedId: string }> {
    const result = (await graphqlClient.graphql({
      query: DELETE_DECK,
      variables: { deckId },
      authMode: "userPool",
    })) as GraphQLResult<{ deleteDeck: { success: boolean; deletedId: string } }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.deleteDeck ?? { success: false, deletedId: deckId };
  },
};
