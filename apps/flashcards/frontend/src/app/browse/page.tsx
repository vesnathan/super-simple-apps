"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn, Input, Accordion, AccordionItem } from "@nextui-org/react";
import { Button, Footer } from "@super-simple-apps/shared-assets";
import debounce from "lodash/debounce";
import type { DeckTag } from "@simple-flashcards/shared";
import { DECK_TAGS } from "@simple-flashcards/shared";
import { usePublicDecksQuery, usePopularDecksQuery } from "@/hooks/useDecksQuery";
import { useDeckStore } from "@/stores/deckStore";
import type { DeckSummary } from "@/schemas/deck";

// Group tags by category
const TAG_CATEGORIES = {
  "Driving": DECK_TAGS.filter((t) =>
    ["driving", "car-license", "motorcycle-license", "truck-license", "learners-permit", "licensing"].includes(t.value)
  ),
  "IT & Tech": DECK_TAGS.filter((t) =>
    ["it", "it-certifications", "aws", "azure", "cybersecurity", "networking", "cloud-computing", "programming"].includes(t.value)
  ),
  "Workplace": DECK_TAGS.filter((t) =>
    ["workplace-safety", "forklift", "osha", "whs"].includes(t.value)
  ),
  "Languages": DECK_TAGS.filter((t) =>
    ["languages", "spanish", "japanese", "french", "german", "chinese"].includes(t.value)
  ),
  "Academic": DECK_TAGS.filter((t) =>
    ["science", "math", "history", "geography", "medical", "nursing", "business"].includes(t.value)
  ),
  "Region": DECK_TAGS.filter((t) =>
    ["australia", "usa", "uk"].includes(t.value)
  ),
};

export default function BrowsePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<DeckTag[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Favorites from store
  const { loadFavorites, toggleFavorite, isFavorite } = useDeckStore();

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Query popular decks (shown when no search)
  const {
    data: popularDecks = [],
    isLoading: popularLoading,
  } = usePopularDecksQuery(10);

  // Query search results (only when searching)
  const isSearching = debouncedSearchQuery.trim().length > 0;
  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetching: searchLoading,
    isFetchingNextPage,
  } = usePublicDecksQuery(debouncedSearchQuery, isSearching);

  // Flatten paginated search results
  const searchResults = useMemo(() => {
    return searchData?.pages.flatMap((page) => page.decks) ?? [];
  }, [searchData]);

  // Use popular decks when not searching, search results when searching
  const baseDecks = isSearching ? searchResults : popularDecks;

  // Filter by selected tags
  const displayedDecks = useMemo(() => {
    if (selectedTags.length === 0) return baseDecks;
    return baseDecks.filter((deck) => {
      const deckWithTags = deck as DeckSummary & { tags?: DeckTag[] };
      if (!deckWithTags.tags) return false;
      return selectedTags.some((tag) => deckWithTags.tags?.includes(tag));
    });
  }, [baseDecks, selectedTags]);

  const isLoading = isSearching ? searchLoading : popularLoading;

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

  const handleDeckClick = (deckId: string) => {
    router.push(`/?id=${deckId}`);
  };

  const toggleTag = (tag: DeckTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <a href="/" className="text-blue-100 hover:text-white transition-colors">
              Home
            </a>
            <span className="text-blue-200">/</span>
            <span>Browse Decks</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Browse Public Flashcard Decks</h1>
          <p className="text-blue-100 max-w-2xl mb-4">
            Explore our library of community flashcard decks
          </p>

          {/* Search */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search decks..."
              value={searchQuery}
              onValueChange={handleSearchChange}
              size="lg"
              className="max-w-xl"
              classNames={{
                input: "text-gray-900",
                inputWrapper: "bg-white shadow-lg",
              }}
              startContent={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            {/* Mobile filter button */}
            <Button
              className="md:hidden bg-white/20 text-white"
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {selectedTags.length > 0 && (
                <span className="ml-1">({selectedTags.length})</span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Filter by Tag</h2>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                )}
              </div>

              <Accordion
                selectionMode="multiple"
                className="px-0"
                itemClasses={{
                  base: "py-0",
                  title: "text-xs font-medium text-gray-500 uppercase tracking-wide",
                  trigger: "py-2 hover:bg-gray-50 rounded",
                  content: "pt-0 pb-2",
                }}
              >
                {Object.entries(TAG_CATEGORIES).map(([category, tags]) => (
                  <AccordionItem
                    key={category}
                    aria-label={category}
                    title={category}
                  >
                    <div className="space-y-1">
                      {tags.map((tag) => (
                        <button
                          key={tag.value}
                          onClick={() => toggleTag(tag.value)}
                          className={cn(
                            "w-full text-left px-2 py-1.5 rounded text-sm transition-colors",
                            selectedTags.includes(tag.value)
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setSidebarOpen(false)}
              />
              <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800">Filter by Tag</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-sm text-blue-600 hover:text-blue-800 mb-4"
                    >
                      Clear all ({selectedTags.length})
                    </button>
                  )}

                  <Accordion
                    selectionMode="multiple"
                    className="px-0"
                    itemClasses={{
                      base: "py-0",
                      title: "text-xs font-medium text-gray-500 uppercase tracking-wide",
                      trigger: "py-2 hover:bg-gray-50 rounded",
                      content: "pt-0 pb-2",
                    }}
                  >
                    {Object.entries(TAG_CATEGORIES).map(([category, tags]) => (
                      <AccordionItem
                        key={category}
                        aria-label={category}
                        title={category}
                      >
                        <div className="space-y-1">
                          {tags.map((tag) => (
                            <button
                              key={tag.value}
                              onClick={() => toggleTag(tag.value)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                                selectedTags.includes(tag.value)
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              )}
                            >
                              {tag.label}
                            </button>
                          ))}
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {isSearching ? (
                  searchLoading ? (
                    "Searching..."
                  ) : (
                    `${displayedDecks.length} result${displayedDecks.length === 1 ? "" : "s"}`
                  )
                ) : selectedTags.length > 0 ? (
                  `${displayedDecks.length} deck${displayedDecks.length === 1 ? "" : "s"}`
                ) : (
                  "Popular Decks"
                )}
              </h2>
              {(selectedTags.length > 0 || isSearching) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Selected Tags Pills */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => {
                  const tagInfo = DECK_TAGS.find((t) => t.value === tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      {tagInfo?.label || tag}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Loading State */}
            {isLoading && displayedDecks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500">Loading decks...</p>
              </div>
            ) : displayedDecks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">No decks found</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                {/* Deck List */}
                <div className="space-y-3">
                  {displayedDecks.map((deck) => {
                    const deckWithMeta = deck as DeckSummary & { tags?: DeckTag[]; description?: string; views?: number };
                    const isFav = isFavorite(deck.id);
                    return (
                      <div
                        key={deck.id}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all group relative"
                      >
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(deck.id);
                          }}
                          className={cn(
                            "absolute top-3 right-3 p-2 rounded-full transition-all",
                            isFav
                              ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                              : "text-gray-300 hover:text-amber-400 hover:bg-gray-50"
                          )}
                          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg
                            className="w-4 h-4"
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
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {deck.cardCount}
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {deck.title}
                              </h3>
                              {deckWithMeta.description && (
                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                  {deckWithMeta.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                <span>{deck.cardCount} cards</span>
                                {deckWithMeta.views !== undefined && deckWithMeta.views > 0 && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {deckWithMeta.views.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Load More - Only when searching */}
                {isSearching && hasNextPage && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      disabled={isFetchingNextPage}
                      onClick={() => fetchNextPage()}
                    >
                      {isFetchingNextPage ? "Loading..." : "Load More Decks"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
