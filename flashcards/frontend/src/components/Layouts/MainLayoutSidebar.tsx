/* eslint-disable no-console */
"use client";

import {
  cn,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { Card } from "shared";
import type { DeckSummary, FrontendDeck, DeckDetail } from "@/schemas/deck";

import { useDeckStore } from "@/stores/deckStore";
import { useAuthStore } from "@/stores/authStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { AddDeckModal } from "@/components/decks/AddDeckModal";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { useUserDecksQuery } from "@/hooks/useDecksQuery";
import { deckService } from "@/services/api";

// Union type for decks displayed in sidebar - can be summaries or local decks
type SidebarDeck = DeckSummary | FrontendDeck;

interface MainLayoutSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function MainLayoutSidebar({
  isMobileOpen = false,
  onMobileClose,
}: MainLayoutSidebarProps) {
  const router = useRouter();
  const {
    setDeck,
    currentlySelectedDeck,
    localDecks,
    addDeck,
    addCard,
    deleteDeck,
  } = useDeckStore();
  const { user, signOut } = useAuthStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddDeckModal, setShowAddDeckModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showDeleteDeckModal, setShowDeleteDeckModal] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<SidebarDeck | null>(null);

  // Query user's decks
  const { data: userDecks = [], isLoading: userDecksLoading } = useUserDecksQuery();

  // Get favorites from store
  const { favoritedDecks, loadFavorites, toggleFavorite, isFavorite } = useDeckStore();

  // My decks = local decks + server decks
  const visibleDecks: SidebarDeck[] = [...localDecks, ...userDecks];

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleDeckSelect = async (deck: SidebarDeck) => {
    // Close mobile menu after selection
    onMobileClose?.();

    // Check if this is a local deck with cards (can set immediately)
    const localDeck = localDecks.find((d) => d.id === deck.id);
    if (localDeck && localDeck.cards) {
      const deckDetail: DeckDetail = {
        id: localDeck.id,
        userId: localDeck.userId,
        title: localDeck.title,
        isPublic: localDeck.isPublic,
        createdAt: localDeck.createdAt,
        lastModified: localDeck.lastModified,
        cards: localDeck.cards,
      };
      setDeck(deckDetail);
    }

    // Update URL with deck ID query param (no page reload)
    router.push(`/?id=${deck.id}`);
  };

  // Helper to get card count from either summary or local deck
  const getCardCount = (deck: SidebarDeck): number => {
    if ("cardCount" in deck && typeof deck.cardCount === "number") {
      return deck.cardCount;
    }
    if ("cards" in deck && deck.cards) {
      return deck.cards.length;
    }
    return 0;
  };

  const handleAddDeck = async (title: string, cards?: Card[]) => {
    try {
      await addDeck(title, cards);
      // Only show add card modal if no cards were provided
      if (!cards || cards.length === 0) {
        setShowAddCardModal(true);
      }
    } catch (error) {
      console.error("Failed to create deck:", error);
    }
  };

  return (
    <div
      className={cn(
        // Base styles
        "fixed top-0 bottom-0 bg-white",
        "flex flex-col",
        "border-r border-gray-200",
        "w-72 md:w-64",
        "shadow-xl md:shadow-sm",
        "z-50",
        // Mobile positioning and animation
        "transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Super Simple</h1>
              <p className="text-xs text-blue-100">Flashcard App</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* My Decks Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          My Decks
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* My Decks Section */}
        {(visibleDecks.length > 0 || userDecksLoading) && (
          <>
            <div className="py-2">
              {userDecksLoading && visibleDecks.length === 0 ? (
                <div className="px-4 py-4 text-center">
                  <div className="w-6 h-6 mx-auto mb-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-500">Loading...</p>
                </div>
              ) : (
                visibleDecks.map((deck) => (
                  <button
                    key={deck.id}
                    className={cn(
                      "w-full px-4 py-3 text-left",
                      "transition-all duration-200",
                      "hover:bg-gray-50",
                      "border-l-4",
                      currentlySelectedDeck?.id === deck.id
                        ? "border-l-blue-600 bg-blue-50"
                        : "border-l-transparent",
                    )}
                    onClick={() => handleDeckSelect(deck)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                          currentlySelectedDeck?.id === deck.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {getCardCount(deck)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            currentlySelectedDeck?.id === deck.id
                              ? "text-blue-600"
                              : "text-gray-700",
                          )}
                        >
                          {deck.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getCardCount(deck)} cards
                        </p>
                      </div>
                      {currentlySelectedDeck?.id === deck.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const deckData = {
                                title: currentlySelectedDeck.title,
                                cards: currentlySelectedDeck.cards.map((card) => ({
                                  id: card.id,
                                  question: card.question,
                                  answer: card.answer,
                                })),
                              };
                              const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: "application/json" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${currentlySelectedDeck.title.replace(/[^a-z0-9]/gi, "_")}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                            aria-label="Download deck as JSON"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeckToDelete(deck);
                              setShowDeleteDeckModal(true);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                            aria-label="Delete deck"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : localDecks.find((d) => d.id === deck.id) ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                          Local
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}

        {/* Favorites Header */}
        <div className="px-4 py-3 bg-gray-50 border-y border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Favorites
          </div>
        </div>

        {/* Favorites List */}
        <div className="py-2">
          {favoritedDecks.length === 0 ? (
            <div className="px-4 py-4 text-center">
              <p className="text-xs text-gray-500">
                No favorites yet. Browse public decks and add some!
              </p>
            </div>
          ) : (
            favoritedDecks.map((deck) => (
              <button
                key={deck.id}
                className={cn(
                  "w-full px-4 py-3 text-left",
                  "transition-all duration-200",
                  "hover:bg-gray-50",
                  "border-l-4",
                  currentlySelectedDeck?.id === deck.id
                    ? "border-l-amber-500 bg-amber-50"
                    : "border-l-transparent",
                )}
                onClick={() => handleDeckSelect(deck)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                      currentlySelectedDeck?.id === deck.id
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {getCardCount(deck)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        currentlySelectedDeck?.id === deck.id
                          ? "text-amber-600"
                          : "text-gray-700",
                      )}
                    >
                      {deck.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getCardCount(deck)} cards
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(deck.id);
                    }}
                    className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-full transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Empty state when no decks at all */}
        {visibleDecks.length === 0 && !userDecksLoading && favoritedDecks.length === 0 && (
          <div className="px-4 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              No decks yet. Create your first deck or browse public decks!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
        <Button
          className="w-full flex items-center justify-center bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 transition-all duration-200"
          onPress={() => router.push("/browse")}
        >
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Browse Public Decks</span>
        </Button>
        <Button
          className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          onPress={() => setShowAddDeckModal(true)}
        >
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create Deck</span>
        </Button>
        {user ? (
          <Button
            className="w-full flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all duration-200"
            onPress={signOut}
          >
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </Button>
        ) : (
          <Button
            className="w-full flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all duration-200"
            onPress={() => setShowAuthModal(true)}
          >
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>{localDecks.length > 0 ? "Sign In to Sync" : "Sign In"}</span>
          </Button>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <AddDeckModal
        isOpen={showAddDeckModal}
        onClose={() => setShowAddDeckModal(false)}
        onSubmit={handleAddDeck}
      />
      <AddCardModal
        editCard={editingCard}
        isOpen={showAddCardModal}
        onClose={() => {
          setShowAddCardModal(false);
          setEditingCard(null);
        }}
        onSubmit={(cardData) => {
          addCard(cardData);
          toast.success("Card added successfully!");
        }}
      />

      {/* Delete Deck Confirmation Modal */}
      <Modal
        isOpen={showDeleteDeckModal}
        onClose={() => {
          setShowDeleteDeckModal(false);
          setDeckToDelete(null);
        }}
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Delete Deck</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">&quot;{deckToDelete?.title}&quot;</span>?
            </p>
            <p className="text-sm text-gray-500">
              This will permanently delete the deck and all {deckToDelete ? getCardCount(deckToDelete) : 0} cards.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setShowDeleteDeckModal(false);
                setDeckToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => {
                if (deckToDelete) {
                  deleteDeck(deckToDelete.id);
                  toast.success("Deck deleted");
                }
                setShowDeleteDeckModal(false);
                setDeckToDelete(null);
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
