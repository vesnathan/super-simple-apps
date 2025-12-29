/* eslint-disable no-console */
import { create } from "zustand";
import type { Card, CardType } from "@simple-flashcards/shared";
import type { FrontendDeck, DeckSummary, DeckDetail } from "@/schemas/deck";
import { useAuthStore } from "./authStore";
import { generateId } from "@/utils/id";
import { deckService } from "@/services/api";
import { localStorageService } from "@/services/localStorage";

interface DeckStore {
  // Sidebar category - persists across navigation
  sidebarCategory: "public" | "private";
  setSidebarCategory: (category: "public" | "private") => void;
  // Currently selected deck - has full cards array for viewing/editing
  currentlySelectedDeck: DeckDetail | null;
  currentCard: Card | null;
  setCurrentCard: (card: Card) => void;
  setDeck: (deck: DeckDetail) => void;
  deleteCard: (card: Card) => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
  syncDeck: (deck: FrontendDeck) => Promise<void>;
  syncLocalDecks: () => Promise<void>;
  // Public decks from API - summary only (cardCount, no cards)
  publicDecks: DeckSummary[];
  publicDecksNextToken: string | null;
  publicDecksSearch: string;
  publicDecksLoading: boolean;
  // User's private decks from API - summary only (cardCount, no cards)
  privateDecks: DeckSummary[];
  // Local decks from localStorage - have full cards array
  localDecks: FrontendDeck[];
  loadLocalDecks: () => void;
  // Favorites
  favoriteIds: string[];
  favoritedDecks: DeckSummary[];
  loadFavorites: () => Promise<void>;
  toggleFavorite: (deckId: string) => void;
  isFavorite: (deckId: string) => boolean;
  addCard: (cardData: {
    question: string;
    answer: string;
    cardType?: CardType | null;
    options?: string[] | null;
    correctOptionIndex?: number | null;
    explanation?: string | null;
  }) => Promise<void>;
  addDeck: (title: string, cards?: Card[]) => Promise<void>;
  loadUserDecks: () => Promise<void>;
  clearUserDecks: () => void;
  loadPublicDecks: () => Promise<void>;
  searchPublicDecks: (search: string) => Promise<void>;
  loadMorePublicDecks: () => Promise<void>;
  updateCard: (
    deckId: string,
    cardId: string,
    updates: Partial<Card>,
  ) => Promise<void>;
  updateDeck: (
    deckId: string,
    updates: { title?: string; isPublic?: boolean },
  ) => Promise<void>;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  // Sidebar category - persists across navigation (default to public for Browse)
  sidebarCategory: "public",
  setSidebarCategory: (category: "public" | "private") => {
    set({ sidebarCategory: category });
  },
  currentlySelectedDeck: null,
  setDeck: (deck: DeckDetail) =>
    set({
      currentlySelectedDeck: deck,
      currentCard: deck.cards.length > 0 ? deck.cards[0] : null,
    }),
  currentCard: null,
  setCurrentCard: (card: Card) => set({ currentCard: card }),
  addCard: async (cardData) => {
    const { currentlySelectedDeck, localDecks } = get();
    const { isLoggedIn } = useAuthStore.getState();

    if (!currentlySelectedDeck) return;

    const newCard: Card = {
      id: generateId(),
      question: cardData.question,
      answer: cardData.answer,
      cardType: cardData.cardType,
      options: cardData.options,
      correctOptionIndex: cardData.correctOptionIndex,
      explanation: cardData.explanation,
    };

    const updatedDeck: DeckDetail = {
      ...currentlySelectedDeck,
      cards: [...currentlySelectedDeck.cards, newCard],
      lastModified: Date.now(),
    };

    const shouldSetCurrentCard = updatedDeck.cards.length === 1;
    const isLocalDeck = localDecks.some((d) => d.id === updatedDeck.id);

    if (isLocalDeck) {
      localStorageService.updateDeck(updatedDeck);

      set((state) => ({
        ...state,
        currentlySelectedDeck: updatedDeck,
        currentCard: shouldSetCurrentCard ? newCard : state.currentCard,
        localDecks: state.localDecks.map((d) =>
          d.id === updatedDeck.id ? updatedDeck : d,
        ),
      }));

      return;
    }

    set((state) => ({
      ...state,
      currentlySelectedDeck: updatedDeck,
      currentCard: shouldSetCurrentCard ? newCard : state.currentCard,
      // Update the summary in privateDecks with new cardCount
      privateDecks: state.privateDecks.map((d) =>
        d.id === updatedDeck.id
          ? { ...d, cardCount: updatedDeck.cards.length, lastModified: updatedDeck.lastModified }
          : d,
      ),
    }));

    if (isLoggedIn) {
      try {
        await deckService.saveDeck(updatedDeck);
      } catch (error) {
        console.error("Failed to save card to backend:", error);
      }
    }
  },
  deleteCard: async (card: Card) => {
    const { currentlySelectedDeck, localDecks, currentCard } = get();
    const { isLoggedIn } = useAuthStore.getState();

    if (!currentlySelectedDeck) return;

    const updatedCards = currentlySelectedDeck.cards.filter((c) => c.id !== card.id);
    const updatedDeck: DeckDetail = {
      ...currentlySelectedDeck,
      cards: updatedCards,
      lastModified: Date.now(),
    };

    // Determine the next current card after deletion
    let newCurrentCard: Card | null = null;
    if (updatedCards.length > 0) {
      // Find the index of the deleted card
      const deletedIndex = currentlySelectedDeck.cards.findIndex((c) => c.id === card.id);
      // Try to stay at the same index, or go to the previous card if we deleted the last one
      const newIndex = Math.min(deletedIndex, updatedCards.length - 1);
      newCurrentCard = updatedCards[newIndex] || null;
    }

    const isLocalDeck = localDecks.some((d) => d.id === updatedDeck.id);

    if (isLocalDeck) {
      localStorageService.updateDeck(updatedDeck);

      set((state) => ({
        ...state,
        currentlySelectedDeck: updatedDeck,
        currentCard: newCurrentCard,
        localDecks: state.localDecks.map((d) =>
          d.id === updatedDeck.id ? updatedDeck : d,
        ),
      }));

      return;
    }

    set((state) => ({
      ...state,
      currentlySelectedDeck: updatedDeck,
      currentCard: newCurrentCard,
      // Update the summary in privateDecks with new cardCount
      privateDecks: state.privateDecks.map((d) =>
        d.id === updatedDeck.id
          ? { ...d, cardCount: updatedDeck.cards.length, lastModified: updatedDeck.lastModified }
          : d,
      ),
    }));

    if (isLoggedIn) {
      try {
        await deckService.saveDeck(updatedDeck);
      } catch (error) {
        console.error("Failed to delete card from backend:", error);
      }
    }
  },

  deleteDeck: async (deckId: string) => {
    const { localDecks, currentlySelectedDeck } = get();
    const { isLoggedIn } = useAuthStore.getState();

    const isLocalDeck = localDecks.some((d) => d.id === deckId);

    if (isLocalDeck) {
      // Delete from localStorage
      localStorageService.deleteDeck(deckId);

      set((state) => ({
        localDecks: state.localDecks.filter((d) => d.id !== deckId),
        currentlySelectedDeck:
          currentlySelectedDeck?.id === deckId ? null : state.currentlySelectedDeck,
        currentCard: currentlySelectedDeck?.id === deckId ? null : state.currentCard,
      }));

      return;
    }

    // Delete from backend
    if (!isLoggedIn) {
      throw new Error("Must be logged in to delete remote deck");
    }

    try {
      await deckService.deleteDeck(deckId);

      set((state) => ({
        privateDecks: state.privateDecks.filter((d) => d.id !== deckId),
        currentlySelectedDeck:
          currentlySelectedDeck?.id === deckId ? null : state.currentlySelectedDeck,
        currentCard: currentlySelectedDeck?.id === deckId ? null : state.currentCard,
      }));
    } catch (error) {
      console.error("Failed to delete deck:", error);
      throw error;
    }
  },

  syncDeck: async (deck: FrontendDeck) => {
    try {
      await deckService.saveDeck(deck);
      // After sync, reload user decks to get updated summaries
      const userDecks = await deckService.getUserDecks();
      set((state) => ({
        privateDecks: userDecks,
        localDecks: state.localDecks.filter((d) => d.id !== deck.id),
      }));
    } catch (error) {
      console.error("Failed to sync deck:", error);
      throw error;
    }
  },

  syncLocalDecks: async () => {
    const localDecks = localStorageService.getDecks();

    if (localDecks.length === 0) {
      return;
    }

    try {
      const selectedDeckId = get().currentlySelectedDeck?.id;

      // Use syncDecks which performs BatchPutItem (upsert) - overwrites existing DDB entries
      await deckService.syncDecks(localDecks);

      // Clear local storage after successful sync
      for (const deck of localDecks) {
        localStorageService.deleteDeck(deck.id);
      }

      const userDecks = await deckService.getUserDecks();

      // If we had a deck selected, fetch its full details
      let selectedDeck: DeckDetail | null = null;
      if (selectedDeckId) {
        selectedDeck = await deckService.getDeck(selectedDeckId, true);
      }

      set(() => ({
        localDecks: [],
        privateDecks: userDecks,
        currentlySelectedDeck: selectedDeck,
      }));
    } catch (error) {
      console.error("Failed to sync local decks:", error);
      throw error;
    }
  },
  publicDecks: [],
  publicDecksNextToken: null,
  publicDecksSearch: "",
  publicDecksLoading: false,
  privateDecks: [],
  localDecks: [],

  // Favorites
  favoriteIds: [],
  favoritedDecks: [],

  loadLocalDecks: () => {
    const decks = localStorageService.getDecks();
    // Also load favorites from localStorage
    const favoriteIds = localStorageService.getFavorites();
    set({ localDecks: decks, favoriteIds });
  },

  loadFavorites: async () => {
    const favoriteIds = localStorageService.getFavorites();
    set({ favoriteIds });

    if (favoriteIds.length === 0) {
      set({ favoritedDecks: [] });
      return;
    }

    try {
      // Fetch the favorited decks from the API
      const decks = await deckService.getDecksByIds(favoriteIds);
      set({ favoritedDecks: decks });
    } catch (error) {
      console.error("Failed to load favorited decks:", error);
      set({ favoritedDecks: [] });
    }
  },

  toggleFavorite: (deckId: string) => {
    const isFavorite = localStorageService.toggleFavorite(deckId);
    const favoriteIds = localStorageService.getFavorites();
    set({ favoriteIds });

    // Update favoritedDecks list
    if (!isFavorite) {
      // Removed from favorites - remove from list
      set((state) => ({
        favoritedDecks: state.favoritedDecks.filter((d) => d.id !== deckId),
      }));
    } else {
      // Added to favorites - fetch the deck and add to list
      deckService.getDeck(deckId, false).then((deck) => {
        if (deck) {
          // Convert DeckDetail to DeckSummary format
          const summary: DeckSummary = {
            id: deck.id,
            userId: deck.userId,
            title: deck.title,
            description: deck.description,
            tags: deck.tags,
            cardCount: deck.cards.length,
            isPublic: deck.isPublic,
            createdAt: deck.createdAt,
            lastModified: deck.lastModified,
          };
          set((state) => ({
            favoritedDecks: [...state.favoritedDecks, summary],
          }));
        }
      }).catch(console.error);
    }
  },

  isFavorite: (deckId: string) => {
    return get().favoriteIds.includes(deckId);
  },

  addDeck: async (title: string, cards: Card[] = []) => {
    try {
      const isLoggedIn = useAuthStore.getState().isLoggedIn;
      const timestamp = Date.now();

      // Ensure cards have IDs
      const cardsWithIds = cards.map((card) => ({
        ...card,
        id: card.id || generateId(),
      }));

      if (!isLoggedIn) {
        // For local decks, create a FrontendDeck (with cards array)
        const newDeck: FrontendDeck = {
          id: generateId(),
          userId: "local",
          title,
          cards: cardsWithIds,
          cardCount: cardsWithIds.length,
          lastModified: timestamp,
          createdAt: new Date(timestamp).toISOString(),
          isPublic: false,
        };

        localStorageService.addDeck(newDeck);
        // For currentlySelectedDeck, we need a DeckDetail (with required cards)
        const deckDetail: DeckDetail = {
          ...newDeck,
          cards: cardsWithIds,
        };
        set((state) => ({
          localDecks: [...state.localDecks, newDeck],
          currentlySelectedDeck: deckDetail,
          currentCard: cardsWithIds.length > 0 ? cardsWithIds[0] : null,
        }));

        return;
      }

      // API returns DeckDetail with full cards array
      const newDeck = await deckService.createDeck(title, cardsWithIds);
      // Also get updated summaries for sidebar
      const userDecks = await deckService.getUserDecks();

      set((state) => ({
        privateDecks: userDecks,
        currentlySelectedDeck: newDeck,
        currentCard: newDeck.cards.length > 0 ? newDeck.cards[0] : null,
      }));
    } catch (error) {
      console.error("Failed to create deck:", error);
      throw error;
    }
  },

  loadPublicDecks: async () => {
    try {
      set({ publicDecksLoading: true });
      const result = await deckService.searchPublicDecks("", 10, undefined);

      set((state) => ({
        ...state,
        publicDecks: result.decks,
        publicDecksNextToken: result.nextToken,
        publicDecksSearch: "",
        publicDecksLoading: false,
      }));
    } catch (error) {
      console.error("Failed to load public decks:", error);
      set({ publicDecksLoading: false });
    }
  },

  searchPublicDecks: async (search: string) => {
    try {
      set({ publicDecksLoading: true, publicDecksSearch: search });
      const result = await deckService.searchPublicDecks(search, 10, undefined);

      set((state) => ({
        ...state,
        publicDecks: result.decks,
        publicDecksNextToken: result.nextToken,
        publicDecksLoading: false,
      }));
    } catch (error) {
      console.error("Failed to search public decks:", error);
      set({ publicDecksLoading: false });
    }
  },

  loadMorePublicDecks: async () => {
    const { publicDecksNextToken, publicDecksSearch, publicDecks } = get();
    if (!publicDecksNextToken) return;

    try {
      set({ publicDecksLoading: true });
      const result = await deckService.searchPublicDecks(
        publicDecksSearch,
        10,
        publicDecksNextToken
      );

      set((state) => ({
        ...state,
        publicDecks: [...publicDecks, ...result.decks],
        publicDecksNextToken: result.nextToken,
        publicDecksLoading: false,
      }));
    } catch (error) {
      console.error("Failed to load more public decks:", error);
      set({ publicDecksLoading: false });
    }
  },

  loadUserDecks: async () => {
    try {
      const userDecks = await deckService.getUserDecks().catch((err) => {
        console.error("Failed to fetch user decks:", err);

        return [];
      });

      set((state) => ({
        ...state,
        privateDecks: userDecks,
      }));
    } catch (error) {
      console.error("Failed to load private decks:", error);
    }
  },

  clearUserDecks: () => {
    set((state) => ({
      ...state,
      privateDecks: [],
      currentlySelectedDeck: null,
      currentCard: null,
    }));
  },

  updateCard: async (
    deckId: string,
    cardId: string,
    updates: Partial<Card>,
  ) => {
    const { currentlySelectedDeck, localDecks, currentCard } = get();
    const { isLoggedIn } = useAuthStore.getState();

    if (!currentlySelectedDeck) return;

    const updatedDeck: DeckDetail = {
      ...currentlySelectedDeck,
      cards: currentlySelectedDeck.cards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card,
      ),
      lastModified: Date.now(),
    };

    // Update currentCard if it's the one being edited
    const updatedCurrentCard = currentCard?.id === cardId
      ? { ...currentCard, ...updates }
      : currentCard;

    const isLocalDeck = localDecks.some((d) => d.id === deckId);

    if (isLocalDeck) {
      // Update local deck
      localStorageService.updateDeck(updatedDeck);
      set((state) => ({
        currentlySelectedDeck: updatedDeck,
        currentCard: updatedCurrentCard,
        localDecks: state.localDecks.map((d) =>
          d.id === deckId ? updatedDeck : d,
        ),
      }));
      return;
    }

    // For remote decks, save via syncDecks (which does actual DynamoDB persist)
    if (!isLoggedIn) {
      throw new Error("Must be logged in to update remote deck");
    }

    try {
      // Use saveDeck which wraps syncDecks for persistence
      await deckService.saveDeck(updatedDeck);
      set((state) => ({
        currentlySelectedDeck: updatedDeck,
        currentCard: updatedCurrentCard,
        // privateDecks stays as summaries - no change needed since card edits don't change cardCount
      }));
    } catch (error) {
      console.error("Failed to update card:", error);
      throw new Error("Failed to update card");
    }
  },

  updateDeck: async (
    deckId: string,
    updates: { title?: string; isPublic?: boolean },
  ) => {
    const { currentlySelectedDeck, localDecks } = get();
    const { isLoggedIn } = useAuthStore.getState();

    if (!currentlySelectedDeck) return;

    const updatedDeck: DeckDetail = {
      ...currentlySelectedDeck,
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.isPublic !== undefined && { isPublic: updates.isPublic }),
      lastModified: Date.now(),
    };

    // Handle local decks
    const isLocalDeck = localDecks.some((d) => d.id === deckId);

    if (isLocalDeck) {
      localStorageService.updateDeck(updatedDeck);
      set((state) => ({
        currentlySelectedDeck: updatedDeck,
        localDecks: state.localDecks.map((d) =>
          d.id === deckId ? updatedDeck : d,
        ),
      }));
      return;
    }

    // Handle remote decks - requires authentication
    if (!isLoggedIn) {
      throw new Error("Must be logged in to update remote deck");
    }

    try {
      const result = await deckService.updateDeck(deckId, updates);
      set((state) => ({
        currentlySelectedDeck: result,
        // Update privateDecks summary with the new title/isPublic
        privateDecks: state.privateDecks.map((d) =>
          d.id === deckId
            ? {
                ...d,
                ...(updates.title !== undefined && { title: updates.title }),
                ...(updates.isPublic !== undefined && { isPublic: updates.isPublic }),
                lastModified: result.lastModified,
              }
            : d,
        ),
      }));
    } catch (error) {
      console.error("Failed to update deck:", error);
      throw error;
    }
  },
}));
