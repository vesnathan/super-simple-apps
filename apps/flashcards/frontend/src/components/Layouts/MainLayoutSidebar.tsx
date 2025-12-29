/* eslint-disable no-console */
"use client";

import {
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { Button, AuthModal, LocalBadge } from "@super-simple-apps/shared-assets";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { Card } from "@simple-flashcards/shared";
import type { DeckSummary, FrontendDeck, DeckDetail } from "@/schemas/deck";

import { useDeckStore } from "@/stores/deckStore";
import { useAuthStore } from "@/stores/authStore";
import { AddDeckModal } from "@/components/decks/AddDeckModal";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { useUserDecksQuery, usePopularDecksQuery } from "@/hooks/useDecksQuery";
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

  // Query popular decks
  const { data: popularDecks = [], isLoading: popularDecksLoading } = usePopularDecksQuery(5);

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
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            title="Flashcards Home"
          >
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
              <h1 className="text-lg font-bold text-white">Flashcards</h1>
              <p className="text-xs text-blue-100">by Super Simple Apps</p>
            </div>
          </a>
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

      {/* Scrollable Content with Accordions */}
      <div className="flex-1 overflow-y-auto">
        <Accordion
          selectionMode="multiple"
          defaultExpandedKeys={["popular"]}
          className="px-0"
          itemClasses={{
            base: "py-0",
            title: "font-medium text-sm",
            trigger: "px-4 py-3 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 data-[open=true]:bg-gray-100",
            indicator: "text-gray-500",
            content: "py-0 px-0",
          }}
        >
          {/* Popular Decks Section */}
          <AccordionItem
            key="popular"
            aria-label="Popular Decks"
            title={
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Popular</span>
                {popularDecks.length > 0 && (
                  <span className="ml-auto text-xs text-gray-400">{popularDecks.length}</span>
                )}
              </div>
            }
          >
            <div className="py-1">
              {popularDecksLoading ? (
                <div className="px-4 py-4 text-center">
                  <div className="w-5 h-5 mx-auto mb-2 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-500">Loading...</p>
                </div>
              ) : popularDecks.length === 0 ? (
                <div className="px-4 py-3 text-center">
                  <p className="text-xs text-gray-500">No popular decks yet</p>
                </div>
              ) : (
                popularDecks.map((deck) => (
                  <button
                    key={deck.id}
                    className={cn(
                      "w-full px-4 py-2.5 text-left",
                      "transition-all duration-200",
                      "hover:bg-orange-50",
                      "border-l-4",
                      currentlySelectedDeck?.id === deck.id
                        ? "border-l-orange-500 bg-orange-50"
                        : "border-l-transparent",
                    )}
                    onClick={() => handleDeckSelect(deck)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium",
                          currentlySelectedDeck?.id === deck.id
                            ? "bg-orange-500 text-white"
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
                              ? "text-orange-600"
                              : "text-gray-700",
                          )}
                        >
                          {deck.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getCardCount(deck)} cards
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </AccordionItem>

          {/* My Decks Section */}
          <AccordionItem
            key="my-decks"
            aria-label="My Decks"
            title={
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
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
                <span>My Decks</span>
                {visibleDecks.length > 0 && (
                  <span className="ml-auto text-xs text-gray-400">{visibleDecks.length}</span>
                )}
              </div>
            }
          >
            <div className="py-1">
              {userDecksLoading && visibleDecks.length === 0 ? (
                <div className="px-4 py-4 text-center">
                  <div className="w-5 h-5 mx-auto mb-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-500">Loading...</p>
                </div>
              ) : visibleDecks.length === 0 ? (
                <div className="px-4 py-3 text-center">
                  <p className="text-xs text-gray-500">No decks yet. Create one!</p>
                </div>
              ) : (
                visibleDecks.map((deck) => (
                  <button
                    key={deck.id}
                    className={cn(
                      "w-full px-4 py-2.5 text-left",
                      "transition-all duration-200",
                      "hover:bg-blue-50",
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
                          "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium",
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
                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                            aria-label="Download deck as JSON"
                          >
                            <svg
                              className="w-3.5 h-3.5"
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
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                            aria-label="Delete deck"
                          >
                            <svg
                              className="w-3.5 h-3.5"
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
                        <LocalBadge />
                      ) : null}
                    </div>
                  </button>
                ))
              )}
            </div>
          </AccordionItem>

          {/* Favorites Section */}
          <AccordionItem
            key="favorites"
            aria-label="Favorites"
            title={
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Favourites</span>
                {favoritedDecks.length > 0 && (
                  <span className="ml-auto text-xs text-gray-400">{favoritedDecks.length}</span>
                )}
              </div>
            }
          >
            <div className="py-1">
              {favoritedDecks.length === 0 ? (
                <div className="px-4 py-3 text-center">
                  <p className="text-xs text-gray-500">
                    No favourites yet. Browse public decks and add some!
                  </p>
                </div>
              ) : (
                favoritedDecks.map((deck) => (
                  <button
                    key={deck.id}
                    className={cn(
                      "w-full px-4 py-2.5 text-left",
                      "transition-all duration-200",
                      "hover:bg-amber-50",
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
                          "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium",
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
                        className="p-1 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-full transition-colors"
                        aria-label="Remove from favourites"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
        <Button
          variant="outline"
          fullWidth
          onClick={() => router.push("/browse")}
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
          variant="primary"
          fullWidth
          onClick={() => setShowAddDeckModal(true)}
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
            variant="secondary"
            fullWidth
            onClick={signOut}
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
            variant="secondary"
            fullWidth
            onClick={() => setShowAuthModal(true)}
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
        useAuthStore={useAuthStore}
        appName="Super Simple"
        appSubtitle="Flashcard App"
        registrationMessage="Create an account to save your flashcard decks"
        appIcon={
          <svg
            className="w-7 h-7 text-white"
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
        }
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
              variant="secondary"
              onClick={() => {
                setShowDeleteDeckModal(false);
                setDeckToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
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
