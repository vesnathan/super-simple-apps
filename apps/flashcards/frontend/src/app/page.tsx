"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { MainLayout } from "@/components/Layouts/MainLayout";
import { DeckView } from "@/components/decks/DeckView";
import { useDeckStore } from "@/stores/deckStore";
import { useAuthStore } from "@/stores/authStore";
import { deckService } from "@/services/api";
import type { DeckDetail } from "@/schemas/deck";

export default function HomePage() {
  const searchParams = useSearchParams();
  const { loadLocalDecks, setDeck, localDecks, currentlySelectedDeck } = useDeckStore();
  const { isLoggedIn, loading: authLoading } = useAuthStore();
  const [isLoadingDeck, setIsLoadingDeck] = useState(false);

  useEffect(() => {
    // Load local decks from localStorage on mount
    // Remote decks are loaded via TanStack Query in the sidebar
    loadLocalDecks();
  }, [loadLocalDecks]);

  // Check for ?id=xxx query parameter and load that deck
  useEffect(() => {
    const deckId = searchParams.get("id");

    // Skip if no id, auth still loading, or deck already loaded
    if (!deckId || authLoading || currentlySelectedDeck?.id === deckId) {
      return;
    }

    async function loadDeckFromId(id: string) {
      setIsLoadingDeck(true);

      // Check local decks first
      const localDeck = localDecks.find((d) => d.id === id);
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
        setIsLoadingDeck(false);
        return;
      }

      // Fetch from API
      try {
        const deck = await deckService.getDeck(id, isLoggedIn);
        if (deck) {
          setDeck(deck);
        }
      } catch (error) {
        console.error("Failed to load deck from URL:", error);
      }
      setIsLoadingDeck(false);
    }

    loadDeckFromId(deckId);
  }, [searchParams, authLoading, isLoggedIn, localDecks, setDeck, currentlySelectedDeck?.id]);

  if (isLoadingDeck) {
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
