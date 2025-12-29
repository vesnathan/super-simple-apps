"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import type { DeckDetail } from "@/schemas/deck";

import { MainLayout } from "@/components/Layouts/MainLayout";
import { DeckView } from "@/components/decks/DeckView";
import { useDeckStore } from "@/stores/deckStore";
import { useAuthStore } from "@/stores/authStore";
import { deckService } from "@/services/api";

export function DeckPageClient() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const { setDeck, localDecks, loadLocalDecks, currentlySelectedDeck } = useDeckStore();
  const { isLoggedIn, loading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Track if we've already loaded this deck to prevent re-fetches
  const loadedDeckIdRef = useRef<string | null>(null);
  const hasLoadedLocalDecksRef = useRef(false);

  useEffect(() => {
    // Load local decks only once on mount
    if (!hasLoadedLocalDecksRef.current) {
      loadLocalDecks();
      hasLoadedLocalDecksRef.current = true;
    }
  }, [loadLocalDecks]);

  useEffect(() => {
    // Skip placeholder route
    if (deckId === "placeholder") {
      router.replace("/");
      return;
    }

    // Wait for auth to initialize
    if (authLoading) {
      return;
    }

    // If we already loaded this deck, don't fetch again
    if (loadedDeckIdRef.current === deckId && currentlySelectedDeck?.id === deckId) {
      setIsLoading(false);
      return;
    }

    // If the deck is already selected (e.g., set by sidebar before navigation), skip fetch
    if (currentlySelectedDeck?.id === deckId) {
      loadedDeckIdRef.current = deckId;
      setIsLoading(false);
      return;
    }

    async function fetchDeck() {
      setIsLoading(true);
      setNotFound(false);

      // 1. Check local decks first
      const localDeck = localDecks.find((d) => d.id === deckId);
      if (localDeck && localDeck.cards) {
        // Convert FrontendDeck to DeckDetail (local decks always have cards)
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
        loadedDeckIdRef.current = deckId;
        setIsLoading(false);
        return;
      }

      // 2. Fetch from API
      try {
        const deck = await deckService.getDeck(deckId, isLoggedIn);
        if (deck) {
          setDeck(deck);
          loadedDeckIdRef.current = deckId;
          setIsLoading(false);
        } else {
          setNotFound(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch deck:", error);
        setNotFound(true);
        setIsLoading(false);
      }
    }

    fetchDeck();
  }, [deckId, localDecks, isLoggedIn, authLoading, setDeck, router, currentlySelectedDeck?.id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] md:ml-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading deck...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (notFound) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 md:ml-64">
          <div className="w-20 h-20 mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Deck Not Found</h2>
          <p className="text-gray-500 max-w-md mb-6">
            The deck you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Go to Home
          </button>
        </div>
      </MainLayout>
    );
  }

  // Only render DeckView when deck is loaded
  if (!currentlySelectedDeck) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] md:ml-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading deck...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DeckView />
    </MainLayout>
  );
}
