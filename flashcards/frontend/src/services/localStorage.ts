import type { FrontendDeck as Deck } from "@/schemas/deck";

export const DECKS_STORAGE_KEY = "flashcards_decks";
export const FAVORITES_STORAGE_KEY = "flashcards_favorites";
export const FAVORITES_INITIALIZED_KEY = "flashcards_favorites_initialized";

// Default favorite deck IDs (set on first visit)
// These are the IDs of popular decks that new users will see
export const DEFAULT_FAVORITE_DECK_IDS: string[] = [];

export const localStorageService = {
  getDecks(): Deck[] {
    if (typeof window === "undefined") return [];
    const decks = localStorage.getItem(DECKS_STORAGE_KEY);

    return decks ? JSON.parse(decks) : [];
  },

  saveDeck(deck: Deck) {
    const decks = this.getDecks();
    const updatedDecks = [...decks, deck];

    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(updatedDecks));
  },

  updateDeck(updatedDeck: Deck) {
    const decks = this.getDecks();
    const newDecks = decks.map((deck) =>
      deck.id === updatedDeck.id ? updatedDeck : deck,
    );

    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(newDecks));
  },

  deleteDeck(deckId: string) {
    const decks = this.getDecks();
    const newDecks = decks.filter((deck) => deck.id !== deckId);

    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(newDecks));
  },

  addDeck(deck: Deck): void {
    const decks = this.getDecks();

    decks.push(deck);
    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
  },

  // Favorites management
  getFavorites(): string[] {
    if (typeof window === "undefined") return [];
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },

  setFavorites(deckIds: string[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(deckIds));
  },

  addFavorite(deckId: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(deckId)) {
      favorites.push(deckId);
      this.setFavorites(favorites);
    }
  },

  removeFavorite(deckId: string): void {
    const favorites = this.getFavorites();
    this.setFavorites(favorites.filter((id) => id !== deckId));
  },

  isFavorite(deckId: string): boolean {
    return this.getFavorites().includes(deckId);
  },

  toggleFavorite(deckId: string): boolean {
    if (this.isFavorite(deckId)) {
      this.removeFavorite(deckId);
      return false;
    } else {
      this.addFavorite(deckId);
      return true;
    }
  },

  // Check if favorites have been initialized (for setting defaults)
  isFavoritesInitialized(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(FAVORITES_INITIALIZED_KEY) === "true";
  },

  markFavoritesInitialized(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(FAVORITES_INITIALIZED_KEY, "true");
  },

  // Initialize with default favorites if not already done
  initializeDefaultFavorites(defaultIds: string[]): void {
    if (this.isFavoritesInitialized()) return;
    this.setFavorites(defaultIds);
    this.markFavoritesInitialized();
  },
};
