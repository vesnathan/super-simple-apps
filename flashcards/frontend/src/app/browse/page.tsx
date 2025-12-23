"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn, Button, Input } from "@nextui-org/react";
import debounce from "lodash/debounce";
import type { DeckTag } from "shared";
import { DECK_TAGS } from "shared";
import { usePublicDecksQuery } from "@/hooks/useDecksQuery";
import { useDeckStore } from "@/stores/deckStore";
import type { DeckSummary } from "@/schemas/deck";

export default function BrowsePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<DeckTag[]>([]);

  // Favorites from store
  const { loadFavorites, toggleFavorite, isFavorite } = useDeckStore();

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Query public decks
  const {
    data: publicDecksData,
    fetchNextPage,
    hasNextPage,
    isFetching: isLoading,
    isFetchingNextPage,
  } = usePublicDecksQuery(debouncedSearchQuery, true);

  // Flatten paginated public decks
  const publicDecks = useMemo(() => {
    return publicDecksData?.pages.flatMap((page) => page.decks) ?? [];
  }, [publicDecksData]);

  // Filter by selected tags
  const filteredDecks = useMemo(() => {
    if (selectedTags.length === 0) return publicDecks;
    return publicDecks.filter((deck) => {
      const deckWithTags = deck as DeckSummary & { tags?: DeckTag[] };
      if (!deckWithTags.tags) return false;
      return selectedTags.some((tag) => deckWithTags.tags?.includes(tag));
    });
  }, [publicDecks, selectedTags]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const toggleTag = (tag: DeckTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDeckClick = (deckId: string) => {
    router.push(`/?id=${deckId}`);
  };

  // Group tags by category for better display
  const tagCategories = {
    "Driving & Licensing": DECK_TAGS.filter((t) =>
      ["driving", "car-license", "motorcycle-license", "truck-license", "learners-permit", "licensing"].includes(t.value)
    ),
    "IT & Technology": DECK_TAGS.filter((t) =>
      ["it", "it-certifications", "aws", "azure", "cybersecurity", "networking", "cloud-computing", "programming"].includes(t.value)
    ),
    "Workplace Safety": DECK_TAGS.filter((t) =>
      ["workplace-safety", "forklift", "osha", "whs"].includes(t.value)
    ),
    Languages: DECK_TAGS.filter((t) =>
      ["languages", "spanish", "japanese", "french", "german", "chinese"].includes(t.value)
    ),
    Academic: DECK_TAGS.filter((t) =>
      ["science", "math", "history", "geography", "medical", "nursing", "business"].includes(t.value)
    ),
    "Region": DECK_TAGS.filter((t) =>
      ["australia", "usa", "uk"].includes(t.value)
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <a href="/" className="text-blue-100 hover:text-white transition-colors">
              Home
            </a>
            <span className="text-blue-200">/</span>
            <span>Browse Decks</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Public Flashcard Decks</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Explore our library of community flashcard decks. Filter by category or search for specific topics.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search decks by title..."
            value={searchQuery}
            onValueChange={handleSearchChange}
            size="lg"
            classNames={{
              input: "text-lg",
              inputWrapper: "bg-white shadow-sm",
            }}
            startContent={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        {/* Tag Filters */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filter by Category</h2>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all ({selectedTags.length})
              </button>
            )}
          </div>

          <div className="space-y-4">
            {Object.entries(tagCategories).map(([category, tags]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => toggleTag(tag.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        selectedTags.includes(tag.value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {filteredDecks.length} {filteredDecks.length === 1 ? "deck" : "decks"} found
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && filteredDecks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading decks...</p>
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No decks found matching your criteria</p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => {
                setSearchQuery("");
                setDebouncedSearchQuery("");
                setSelectedTags([]);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Deck Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecks.map((deck) => {
                const deckWithTags = deck as DeckSummary & { tags?: DeckTag[]; description?: string; views?: number };
                const isFav = isFavorite(deck.id);
                return (
                  <div
                    key={deck.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left group relative"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(deck.id);
                      }}
                      className={cn(
                        "absolute top-4 right-4 p-2 rounded-full transition-all",
                        isFav
                          ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                          : "text-gray-300 hover:text-amber-400 hover:bg-gray-50"
                      )}
                      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={isFav ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDeckClick(deck.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {deck.cardCount}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors pr-8">
                        {deck.title}
                      </h3>
                      {deckWithTags.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {deckWithTags.description}
                        </p>
                      )}
                      {deckWithTags.tags && deckWithTags.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {deckWithTags.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
                            >
                              {tag.replace(/-/g, " ")}
                            </span>
                          ))}
                          {deckWithTags.tags.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                              +{deckWithTags.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                        <span>{deck.cardCount} cards</span>
                        {deckWithTags.views !== undefined && deckWithTags.views > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {deckWithTags.views.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasNextPage && (
              <div className="text-center mt-8">
                <Button
                  color="primary"
                  variant="flat"
                  size="lg"
                  isLoading={isFetchingNextPage}
                  onPress={() => fetchNextPage()}
                >
                  Load More Decks
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="/" className="hover:text-gray-700">Home</a>
            <a href="/about" className="hover:text-gray-700">About</a>
            <a href="/contact" className="hover:text-gray-700">Contact</a>
            <a href="/privacy" className="hover:text-gray-700">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-700">Terms of Service</a>
          </div>
          <p>&copy; {new Date().getFullYear()} Super Simple Flashcards. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
