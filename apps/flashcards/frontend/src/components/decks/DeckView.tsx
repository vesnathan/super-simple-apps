"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Card as HeroCard,
  CardBody,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  cn,
  Tooltip,
} from "@nextui-org/react";
import { Button, WelcomeScreen, AdBanner, Footer } from "@super-simple-apps/shared-assets";
import { toast } from "react-toastify";
import type { Card } from "@simple-flashcards/shared";

import { AddCardModal } from "../../components/cards/AddCardModal";
import { useDeckStore } from "../../stores/deckStore";
import { useAuthStore } from "../../stores/authStore";
import { deckService } from "../../services/api";

import { LocalDeckWarning } from "./LocalDeckWarning";

type UpdateStatus = "idle" | "updating" | "success" | "error";

// Session stats interface
interface SessionStats {
  totalCards: number;
  cardsReviewed: number;
  gotItCount: number;
  nextCount: number;
  rounds: number;
}

export const DeckView: React.FC = (): JSX.Element => {
  const {
    currentlySelectedDeck,
    deleteCard,
    deleteDeck,
    currentCard,
    setCurrentCard,
    addCard,
    localDecks,
    updateDeck,
    updateCard,
    toggleFavorite,
    isFavorite,
  } = useDeckStore();
  const { user } = useAuthStore();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [showDeleteDeckModal, setShowDeleteDeckModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [publicUpdateStatus, setPublicUpdateStatus] = useState<UpdateStatus>("idle");

  // Multiple choice state
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnsweredMC, setHasAnsweredMC] = useState(false);

  // Report card state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  // Session-based progress tracking (persisted to localStorage)
  const [skippedCardIds, setSkippedCardIds] = useState<Set<string>>(new Set());
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalCards: 0,
    cardsReviewed: 0,
    gotItCount: 0,
    nextCount: 0,
    rounds: 1,
  });
  const [showSessionComplete, setShowSessionComplete] = useState(false);

  // Helper to get localStorage key for a deck
  const getStorageKey = useCallback((deckId: string) => `flashcards-progress-${deckId}`, []);

  // Load progress from localStorage when deck changes
  useEffect(() => {
    if (currentlySelectedDeck) {
      const storageKey = getStorageKey(currentlySelectedDeck.id);
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const savedIdsArray: string[] = parsed.skippedCardIds || [];
          // Only restore IDs that still exist in the deck
          const validIdsArray = savedIdsArray.filter(id =>
            currentlySelectedDeck.cards?.some(c => c.id === id)
          );
          const validIds = new Set<string>(validIdsArray);
          setSkippedCardIds(validIds);
          setSessionStats({
            totalCards: currentlySelectedDeck.cards?.length || 0,
            cardsReviewed: parsed.cardsReviewed || 0,
            gotItCount: validIds.size,
            nextCount: parsed.nextCount || 0,
            rounds: parsed.rounds || 1,
          });
          // Show complete if all cards are mastered
          if (validIds.size === currentlySelectedDeck.cards?.length) {
            setShowSessionComplete(true);
          } else {
            setShowSessionComplete(false);
          }
        } catch {
          // Invalid data, start fresh
          setSkippedCardIds(new Set());
          setSessionStats({
            totalCards: currentlySelectedDeck.cards?.length || 0,
            cardsReviewed: 0,
            gotItCount: 0,
            nextCount: 0,
            rounds: 1,
          });
          setShowSessionComplete(false);
        }
      } else {
        // No saved progress, start fresh
        setSkippedCardIds(new Set());
        setSessionStats({
          totalCards: currentlySelectedDeck.cards?.length || 0,
          cardsReviewed: 0,
          gotItCount: 0,
          nextCount: 0,
          rounds: 1,
        });
        setShowSessionComplete(false);
      }
    }
  }, [currentlySelectedDeck?.id, currentlySelectedDeck?.cards?.length, getStorageKey]);

  // Shuffle function using Fisher-Yates algorithm with seed
  const shuffledCards = useMemo(() => {
    if (!currentlySelectedDeck?.cards || !isShuffled) {
      return currentlySelectedDeck?.cards || [];
    }

    const cards = [...currentlySelectedDeck.cards];
    // Use shuffleSeed to create consistent shuffle until re-shuffled
    let seed = shuffleSeed || Date.now();
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, [currentlySelectedDeck?.cards, isShuffled, shuffleSeed]);

  // Filter out skipped cards from display
  const allCards = isShuffled ? shuffledCards : (currentlySelectedDeck?.cards || []);
  const displayCards = useMemo(() => {
    return allCards.filter((card) => !skippedCardIds.has(card.id));
  }, [allCards, skippedCardIds]);

  const currentIndex = currentCard
    ? displayCards.findIndex((card: Card) => card.id === currentCard.id)
    : -1;

  const isLastCard = currentIndex === displayCards.length - 1;

  // Move to next card (used by both "Got it" and "Next")
  const moveToNextCard = useCallback(() => {
    setShowAnswer(false);
    if (displayCards.length > 0 && currentCard) {
      const idx = displayCards.findIndex((card: Card) => card.id === currentCard.id);
      const next = displayCards[idx + 1];
      if (next) {
        setCurrentCard(next);
      }
    }
  }, [displayCards, currentCard, setCurrentCard]);

  // Handle "Got it" - skip card for rest of session and move to next
  const handleGotIt = useCallback(() => {
    if (!currentCard || !currentlySelectedDeck) return;

    const newSkippedIds = new Set(skippedCardIds);
    newSkippedIds.add(currentCard.id);
    setSkippedCardIds(newSkippedIds);

    const newStats = {
      ...sessionStats,
      cardsReviewed: sessionStats.cardsReviewed + 1,
      gotItCount: sessionStats.gotItCount + 1,
    };
    setSessionStats(newStats);

    // Reset multiple choice state
    setSelectedOptionIndex(null);
    setHasAnsweredMC(false);
    setShowAnswer(false);

    // Persist to localStorage
    const storageKey = getStorageKey(currentlySelectedDeck.id);
    localStorage.setItem(storageKey, JSON.stringify({
      skippedCardIds: Array.from(newSkippedIds),
      cardsReviewed: newStats.cardsReviewed,
      nextCount: newStats.nextCount,
      rounds: newStats.rounds,
    }));

    // Check if this was the last remaining card
    const remainingCards = displayCards.filter((c) => c.id !== currentCard.id);
    if (remainingCards.length === 0) {
      setShowSessionComplete(true);
    } else {
      // Move to next card, or first if at end
      const idx = displayCards.findIndex((c) => c.id === currentCard.id);
      const nextIdx = idx < remainingCards.length ? idx : 0;
      setCurrentCard(remainingCards[nextIdx] || remainingCards[0]);
      setShowAnswer(false);
    }
  }, [currentCard, currentlySelectedDeck, displayCards, skippedCardIds, sessionStats, setCurrentCard, getStorageKey]);

  // Handle "Next" - just move to next card without skipping
  const handleNext = useCallback(() => {
    if (!currentCard) return;

    setSessionStats((prev) => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1,
      nextCount: prev.nextCount + 1,
    }));

    // Reset multiple choice state
    setSelectedOptionIndex(null);
    setHasAnsweredMC(false);
    setShowAnswer(false);

    if (isLastCard) {
      // End of deck reached
      setShowSessionComplete(true);
    } else {
      moveToNextCard();
    }
  }, [currentCard, isLastCard, moveToNextCard]);

  // Handle "Study Again" - restart with remaining cards
  const handleStudyAgain = useCallback(() => {
    setSessionStats((prev) => ({
      ...prev,
      rounds: prev.rounds + 1,
    }));
    setShowSessionComplete(false);
    setShowAnswer(false);

    // Start from first remaining card
    if (displayCards.length > 0) {
      setCurrentCard(displayCards[0]);
    }
  }, [displayCards, setCurrentCard]);

  // Handle "Reset Session" - clear all progress and start fresh
  const handleResetSession = useCallback(() => {
    setSkippedCardIds(new Set());
    setSessionStats({
      totalCards: currentlySelectedDeck?.cards?.length || 0,
      cardsReviewed: 0,
      gotItCount: 0,
      nextCount: 0,
      rounds: 1,
    });
    setShowSessionComplete(false);
    setShowAnswer(false);

    // Clear from localStorage
    if (currentlySelectedDeck) {
      const storageKey = getStorageKey(currentlySelectedDeck.id);
      localStorage.removeItem(storageKey);
    }

    // Start from first card
    const cards = isShuffled ? shuffledCards : (currentlySelectedDeck?.cards || []);
    if (cards.length > 0) {
      setCurrentCard(cards[0]);
    }
  }, [currentlySelectedDeck, isShuffled, shuffledCards, setCurrentCard, getStorageKey]);

  const handleShuffleToggle = (checked: boolean) => {
    setIsShuffled(checked);
    if (checked) {
      // Generate new shuffle seed
      setShuffleSeed(Date.now());
      // Reset to first card in shuffled order
      if (displayCards.length > 0) {
        setCurrentCard(displayCards[0]);
      }
    } else {
      // Reset to first card in original order
      const cards = (currentlySelectedDeck?.cards || []).filter(
        (c) => !skippedCardIds.has(c.id)
      );
      if (cards.length > 0) {
        setCurrentCard(cards[0]);
      }
    }
    setShowAnswer(false);
  };

  const handlePublicToggle = async (checked: boolean) => {
    if (!currentlySelectedDeck) return;

    setPublicUpdateStatus("updating");
    try {
      await updateDeck(currentlySelectedDeck.id, { isPublic: checked });
      setPublicUpdateStatus("success");
      toast.success(checked ? "Deck is now public" : "Deck is now private");
      // Reset status after a short delay
      setTimeout(() => setPublicUpdateStatus("idle"), 2000);
    } catch (error) {
      setPublicUpdateStatus("error");
      toast.error("Failed to update deck visibility");
      // Reset status after a short delay
      setTimeout(() => setPublicUpdateStatus("idle"), 2000);
    }
  };

  const handleAddOrUpdateCard = async (cardData: {
    question: string;
    answer: string;
    cardType: "text" | "multiple-choice";
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }) => {
    if (!currentlySelectedDeck) return;

    if (editingCard) {
      // Update existing card
      try {
        await updateCard(currentlySelectedDeck.id, editingCard.id, {
          question: cardData.question,
          answer: cardData.answer,
          cardType: cardData.cardType,
          options: cardData.cardType === "multiple-choice" ? cardData.options : undefined,
          correctOptionIndex: cardData.cardType === "multiple-choice" ? cardData.correctOptionIndex : undefined,
          explanation: cardData.explanation || undefined,
        });
        toast.success("Card updated successfully!");
      } catch (error) {
        toast.error("Failed to update card");
      }
    } else {
      // Add new card
      addCard({
        question: cardData.question,
        answer: cardData.answer,
        cardType: cardData.cardType,
        options: cardData.cardType === "multiple-choice" ? cardData.options : undefined,
        correctOptionIndex: cardData.cardType === "multiple-choice" ? cardData.correctOptionIndex : undefined,
        explanation: cardData.explanation || undefined,
      });

      if (
        currentlySelectedDeck &&
        currentlySelectedDeck.cards &&
        currentlySelectedDeck.cards.length === 1
      ) {
        setCurrentCard(currentlySelectedDeck.cards[0]);
      }

      toast.success("Card added successfully!");
    }
  };

  const handleDeleteCard = () => {
    if (currentCard) {
      deleteCard(currentCard);
      setShowDeleteCardModal(false);
      toast.success("Card deleted successfully!");
    }
  };

  const handleDeleteDeck = async () => {
    if (!currentlySelectedDeck) return;

    try {
      await deleteDeck(currentlySelectedDeck.id);
      setShowDeleteDeckModal(false);
      toast.success("Deck deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete deck");
    }
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setShowAddCardModal(true);
  };

  const handleReportCard = async () => {
    if (!currentCard || !currentlySelectedDeck || !reportReason.trim()) return;

    setIsReporting(true);
    try {
      await deckService.reportCard(currentlySelectedDeck.id, currentCard.id, reportReason.trim());
      toast.success("Report submitted. Thank you for helping improve our content!");
      setShowReportModal(false);
      setReportReason("");
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  // Check if the currently selected deck is a local deck
  // Local decks have userId === "local" or exist in the localDecks array
  const isLocalDeck = currentlySelectedDeck
    ? currentlySelectedDeck.userId === "local" || localDecks.some((d) => d.id === currentlySelectedDeck.id)
    : false;

  // User can edit if it's a local deck OR if the deck belongs to the logged-in user
  const canEditDeck =
    isLocalDeck ||
    (user && currentlySelectedDeck?.userId === user.userId);

  const formatDate = (value: string | number) => {
    const date = typeof value === "string" ? new Date(value) : new Date(value);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "min-h-screen p-4 md:p-8",
        "md:ml-64", // Offset for sidebar on desktop
      )}
    >
      <div className="max-w-4xl mx-auto">
        {/* Welcome state when no deck selected - SEO-rich landing content */}
        {!currentlySelectedDeck && (
          <WelcomeScreen
            title="Welcome to Super Simple Flashcards"
            subtitle="The free, easy-to-use flashcard app for effective learning. Create your own decks or study from our community library."
            primaryCta={{
              label: "Browse Public Decks",
              href: "/browse",
            }}
            secondaryCta={{
              label: "Learn More",
              href: "/about",
            }}
            features={[
              {
                icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
                iconBgColor: "bg-green-100",
                title: "100% Free",
                description: "No hidden fees, no premium tiers. All features available to everyone for free.",
              },
              {
                icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
                iconBgColor: "bg-blue-100",
                title: "Easy to Use",
                description: "Create decks in seconds. No complex setup, just start learning immediately.",
              },
              {
                icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                iconBgColor: "bg-purple-100",
                title: "Access Anywhere",
                description: "Study on any device. Your decks sync across desktop, tablet, and mobile.",
              },
            ]}
            featuresSectionTitle="Why Choose Super Simple Flashcards?"
            howItWorks={[
              {
                title: "Create Your Deck",
                description: "Add questions and answers to build your flashcard deck. Organize by subject or topic.",
              },
              {
                title: "Study & Review",
                description: "Flip through cards, mark ones you know, and focus on what you need to learn.",
              },
              {
                title: "Share & Discover",
                description: "Make your decks public or browse thousands of community-created study materials.",
              },
            ]}
            useCases={[
              { emoji: "📚", title: "Students", subtitle: "Ace your exams" },
              { emoji: "🌍", title: "Language Learners", subtitle: "Master vocabulary" },
              { emoji: "💼", title: "Professionals", subtitle: "Certifications & skills" },
              { emoji: "🧠", title: "Lifelong Learners", subtitle: "Never stop growing" },
            ]}
            useCasesSectionTitle="Perfect for Everyone"
            showAdBanner={true}
          />
        )}

        {/* Deck Header */}
        {currentlySelectedDeck && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentlySelectedDeck.title}
                  </h1>
                  <Tooltip content={isFavorite(currentlySelectedDeck.id) ? "Remove from favorites" : "Add to favorites"}>
                    <button
                      onClick={() => {
                        const wasFavorite = isFavorite(currentlySelectedDeck.id);
                        toggleFavorite(currentlySelectedDeck.id);
                        toast.success(
                          wasFavorite
                            ? "Removed from favorites"
                            : "Added to favorites"
                        );
                      }}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label={isFavorite(currentlySelectedDeck.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isFavorite(currentlySelectedDeck.id)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400 hover:text-yellow-500"
                        )}
                        fill={isFavorite(currentlySelectedDeck.id) ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
                {/* Description */}
                {currentlySelectedDeck.description && (
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {currentlySelectedDeck.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    {currentlySelectedDeck.cards?.length || 0} cards
                  </span>
                  {currentlySelectedDeck.createdAt && (
                    <span className="flex items-center gap-1">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(currentlySelectedDeck.createdAt)}
                    </span>
                  )}
                </div>
                {/* Social Sharing Links - Only show for public decks */}
                {currentlySelectedDeck.isPublic && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-gray-400 mr-1">Share:</span>
                  {/* Twitter/X */}
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}?id=${currentlySelectedDeck.id}`;
                      const text = `Check out this flashcard deck: ${currentlySelectedDeck.title}`;
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Share on X/Twitter"
                    title="Share on X"
                  >
                    <svg className="w-4 h-4 text-gray-500 hover:text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  {/* Facebook */}
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}?id=${currentlySelectedDeck.id}`;
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                  >
                    <svg className="w-4 h-4 text-gray-500 hover:text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  {/* LinkedIn */}
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}?id=${currentlySelectedDeck.id}`;
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-4 h-4 text-gray-500 hover:text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                  {/* Copy Link */}
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}?id=${currentlySelectedDeck.id}`;
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("Link copied to clipboard!");
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Copy link"
                    title="Copy link"
                  >
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                )}
              </div>
              {/* Progress indicator */}
              {currentlySelectedDeck.cards &&
                currentlySelectedDeck.cards.length > 0 && (
                  <div className="flex flex-col items-end gap-2">
                    {/* Progress */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Card {(currentIndex ?? 0) + 1} of{" "}
                        {displayCards.length}
                      </p>
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${(((currentIndex ?? 0) + 1) / displayCards.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    {/* Shuffle toggle */}
                    <div className="flex items-center gap-2">
                      <Switch
                        isSelected={isShuffled}
                        onValueChange={handleShuffleToggle}
                        size="sm"
                        classNames={{
                          base: "inline-flex flex-row-reverse gap-2",
                          wrapper: "bg-gray-200 group-data-[selected=true]:bg-blue-600",
                          thumb: "bg-white shadow-sm",
                        }}
                      >
                        <span className="text-sm text-gray-600">Shuffle</span>
                      </Switch>
                    </div>
                    {/* Make Public toggle - only for owned decks */}
                    {canEditDeck && !isLocalDeck && (
                      <div className="flex items-center gap-2">
                        <Switch
                          isSelected={currentlySelectedDeck?.isPublic ?? false}
                          onValueChange={handlePublicToggle}
                          isDisabled={publicUpdateStatus === "updating"}
                          size="sm"
                          classNames={{
                            base: "inline-flex flex-row-reverse gap-2",
                            wrapper: "bg-gray-200 group-data-[selected=true]:bg-green-600",
                            thumb: "bg-white shadow-sm",
                          }}
                        >
                          <span className="text-sm text-gray-600">
                            {publicUpdateStatus === "updating" ? "Updating..." : "Public"}
                          </span>
                        </Switch>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Local Warning */}
        {isLocalDeck && <LocalDeckWarning />}

        {/* Ad Banner - Between header and card */}
        {currentlySelectedDeck && currentlySelectedDeck.cards && currentlySelectedDeck.cards.length > 0 && (
          <div className="mb-6">
            <AdBanner />
          </div>
        )}

        {/* Empty Deck State */}
        {currentlySelectedDeck &&
          (!currentlySelectedDeck.cards ||
            currentlySelectedDeck.cards.length === 0) && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
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
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No cards yet
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first flashcard to start learning
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddCardModal(true)}
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
                <span>Add First Card</span>
              </Button>
            </div>
          )}

        {/* Session Complete Summary Screen */}
        {showSessionComplete && currentlySelectedDeck && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {displayCards.length === 0 ? "Session Complete!" : "Round Complete!"}
            </h2>
            <p className="text-gray-500 mb-6">
              {displayCards.length === 0
                ? "You've mastered all cards in this deck!"
                : `You've gone through all remaining cards. ${displayCards.length} card${displayCards.length === 1 ? "" : "s"} left to review.`}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{sessionStats.rounds}</div>
                <div className="text-sm text-gray-500">Round{sessionStats.rounds === 1 ? "" : "s"}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{sessionStats.cardsReviewed}</div>
                <div className="text-sm text-gray-500">Cards Reviewed</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{sessionStats.gotItCount}</div>
                <div className="text-sm text-gray-500">Got It</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{sessionStats.nextCount}</div>
                <div className="text-sm text-gray-500">Need Review</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {displayCards.length > 0 ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStudyAgain}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Study Again ({displayCards.length} card{displayCards.length === 1 ? "" : "s"})
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleResetSession}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Start Again
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Flashcard */}
        {!showSessionComplete && displayCards.length > 0 && currentCard && (
            <div className="space-y-6">
              {/* The Card - Text Type */}
              {(!currentCard.cardType || currentCard.cardType === "text") && (
                <HeroCard
                  className={cn(
                    "w-full min-h-[300px] md:min-h-[400px]",
                    "shadow-lg hover:shadow-xl transition-all duration-300",
                    "border border-gray-100",
                    "flex flex-col",
                    showAnswer
                      ? "bg-gradient-to-br from-green-50 to-emerald-50"
                      : "bg-white",
                  )}
                >
                  <CardBody
                    className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 cursor-pointer"
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    <span
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-full mb-4",
                        showAnswer
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700",
                      )}
                    >
                      {showAnswer ? "Answer" : "Question"}
                    </span>
                    {/* Card Image */}
                    {currentCard.imageUrl && (
                      <div className="mb-4 max-w-full">
                        <img
                          src={currentCard.imageUrl}
                          alt="Card illustration"
                          className="max-h-48 md:max-h-64 w-auto mx-auto rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                    <div className="text-xl md:text-2xl text-gray-800 text-center font-medium leading-relaxed">
                      {showAnswer ? currentCard.answer : currentCard.question}
                    </div>
                    {/* Research link - shown on question side */}
                    {!showAnswer && currentCard.researchUrl && (
                      <a
                        href={currentCard.researchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Research this topic
                      </a>
                    )}
                    {/* Show explanation if available and answer is shown */}
                    {showAnswer && currentCard.explanation && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 w-full max-w-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Explanation: </span>
                          {currentCard.explanation}
                        </p>
                      </div>
                    )}
                    {/* Report Incorrect link - Show when answer is visible for public decks user doesn't own */}
                    {showAnswer && !canEditDeck && currentlySelectedDeck?.isPublic && (
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
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
                        Report incorrect
                      </button>
                    )}
                    <p className="text-sm text-gray-400 mt-6">
                      Tap card to flip
                    </p>
                  </CardBody>
                  <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="primary"
                        className="flex-1 sm:flex-none min-w-[120px]"
                        onClick={() => setShowAnswer(!showAnswer)}
                      >
                        {showAnswer ? "Show Question" : "Show Answer"}
                      </Button>
                      <Tooltip
                        content="Skip this card for the rest of the session"
                        placement="top"
                        delay={500}
                      >
                        <Button
                          variant="success"
                          className="flex-1 sm:flex-none"
                          onClick={handleGotIt}
                        >
                          <span>Got it</span>
                          <svg
                            className="w-4 h-4 ml-1 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                      </Tooltip>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={handleNext}
                      >
                        <span>Next</span>
                        <svg
                          className="w-4 h-4 ml-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </div>
                  </CardFooter>
                </HeroCard>
              )}

              {/* The Card - Multiple Choice Type */}
              {currentCard.cardType === "multiple-choice" && currentCard.options && (
                <HeroCard
                  className={cn(
                    "w-full min-h-[300px] md:min-h-[400px]",
                    "shadow-lg hover:shadow-xl transition-all duration-300",
                    "border border-gray-100",
                    "flex flex-col",
                    "bg-white",
                  )}
                >
                  <CardBody className="flex-1 flex flex-col p-6 md:p-10">
                    {/* Question */}
                    <span className="text-xs font-medium px-3 py-1 rounded-full mb-4 bg-purple-100 text-purple-700 self-center">
                      Multiple Choice
                    </span>
                    {/* Card Image */}
                    {currentCard.imageUrl && (
                      <div className="mb-4 max-w-full self-center">
                        <img
                          src={currentCard.imageUrl}
                          alt="Card illustration"
                          className="max-h-48 md:max-h-64 w-auto mx-auto rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                    <div className="text-xl md:text-2xl text-gray-800 text-center font-medium leading-relaxed mb-4">
                      {currentCard.question}
                    </div>
                    {/* Research link - shown before answering */}
                    {!hasAnsweredMC && currentCard.researchUrl && (
                      <a
                        href={currentCard.researchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors self-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Research this topic
                      </a>
                    )}

                    {/* Options */}
                    <div className="space-y-3 w-full max-w-lg mx-auto">
                      {currentCard.options.map((option, index) => {
                        const isSelected = selectedOptionIndex === index;
                        const isCorrect = index === currentCard.correctOptionIndex;
                        const showResult = hasAnsweredMC;

                        let buttonClass = "w-full p-4 text-left border rounded-lg transition-all ";
                        if (showResult) {
                          if (isCorrect) {
                            buttonClass += "bg-green-50 border-green-500 text-green-800";
                          } else if (isSelected && !isCorrect) {
                            buttonClass += "bg-red-50 border-red-500 text-red-800";
                          } else {
                            buttonClass += "bg-gray-50 border-gray-200 text-gray-500";
                          }
                        } else if (isSelected) {
                          buttonClass += "bg-blue-50 border-blue-500 text-blue-800";
                        } else {
                          buttonClass += "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800";
                        }

                        return (
                          <button
                            key={index}
                            className={buttonClass}
                            onClick={() => {
                              if (!hasAnsweredMC) {
                                setSelectedOptionIndex(index);
                                setHasAnsweredMC(true);
                              }
                            }}
                            disabled={hasAnsweredMC}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
                                showResult && isCorrect ? "bg-green-500 text-white" :
                                showResult && isSelected && !isCorrect ? "bg-red-500 text-white" :
                                isSelected ? "bg-blue-500 text-white" :
                                "bg-gray-100 text-gray-600"
                              )}>
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="flex-1">{option}</span>
                              {showResult && isCorrect && (
                                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation - shown after answering */}
                    {hasAnsweredMC && currentCard.explanation && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 w-full max-w-lg mx-auto">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Explanation: </span>
                          {currentCard.explanation}
                        </p>
                      </div>
                    )}

                    {/* Result message */}
                    {hasAnsweredMC && (
                      <div className={cn(
                        "mt-4 text-center text-sm font-medium",
                        selectedOptionIndex === currentCard.correctOptionIndex ? "text-green-600" : "text-red-600"
                      )}>
                        {selectedOptionIndex === currentCard.correctOptionIndex ? "Correct!" : "Incorrect - see the correct answer above"}
                      </div>
                    )}

                    {/* Report Incorrect link - Show when answered for public decks user doesn't own */}
                    {hasAnsweredMC && !canEditDeck && currentlySelectedDeck?.isPublic && (
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
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
                        Report incorrect
                      </button>
                    )}
                  </CardBody>
                  <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Tooltip
                        content="Skip this card for the rest of the session"
                        placement="top"
                        delay={500}
                      >
                        <Button
                          variant="success"
                          className="flex-1 sm:flex-none"
                          onClick={handleGotIt}
                          disabled={!hasAnsweredMC}
                        >
                          <span>Got it</span>
                          <svg
                            className="w-4 h-4 ml-1 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                      </Tooltip>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={handleNext}
                        disabled={!hasAnsweredMC}
                      >
                        <span>Next</span>
                        <svg
                          className="w-4 h-4 ml-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </div>
                  </CardFooter>
                </HeroCard>
              )}

              {/* Card Actions - Only show for owned decks */}
              {canEditDeck && (
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddCardModal(true)}
                  >
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
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
                    <span>Add Card</span>
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!currentCard}
                    onClick={() => handleEditCard(currentCard!)}
                  >
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="danger"
                    disabled={!currentCard}
                    onClick={() => setShowDeleteCardModal(true)}
                  >
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
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
                    <span>Delete Card</span>
                  </Button>
                </div>
              )}


            </div>
          )}

        {/* Modals */}
        <AddCardModal
          editCard={editingCard}
          isOpen={showAddCardModal}
          onClose={() => {
            setShowAddCardModal(false);
            setEditingCard(null);
          }}
          onSubmit={handleAddOrUpdateCard}
        />

        {/* Delete Card Modal */}
        <Modal
          isOpen={showDeleteCardModal}
          onClose={() => setShowDeleteCardModal(false)}
          backdrop="blur"
          placement="center"
          classNames={{
            wrapper: "md:pl-64",
            backdrop: "bg-black/50",
          }}
        >
          <ModalContent className="bg-white shadow-xl rounded-xl">
            <ModalHeader className="border-b border-gray-100 p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Card
              </h2>
            </ModalHeader>
            <ModalBody className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete this card? This action cannot be
                undone.
              </p>
            </ModalBody>
            <ModalFooter className="border-t border-gray-100 p-4">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteCardModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteCard}
                >
                  Delete
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Deck Modal */}
        <Modal
          isOpen={showDeleteDeckModal}
          onClose={() => setShowDeleteDeckModal(false)}
          backdrop="blur"
          placement="center"
          classNames={{
            wrapper: "md:pl-64",
            backdrop: "bg-black/50",
          }}
        >
          <ModalContent className="bg-white shadow-xl rounded-xl">
            <ModalHeader className="border-b border-gray-100 p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Deck
              </h2>
            </ModalHeader>
            <ModalBody className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete &quot;{currentlySelectedDeck?.title}&quot;?
                This will permanently delete the deck and all its cards. This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter className="border-t border-gray-100 p-4">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDeckModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteDeck}
                >
                  Delete Deck
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Report Card Modal */}
        <Modal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportReason("");
          }}
          backdrop="blur"
          placement="center"
          classNames={{
            wrapper: "md:pl-64",
            backdrop: "bg-black/50",
          }}
        >
          <ModalContent className="bg-white shadow-xl rounded-xl">
            <ModalHeader className="border-b border-gray-100 p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Report Incorrect Card
              </h2>
            </ModalHeader>
            <ModalBody className="p-6">
              <p className="text-gray-600 mb-4">
                Help us improve! Please describe what&apos;s incorrect about this card.
              </p>
              {currentCard && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Current card:</p>
                  <p className="font-medium text-gray-800">{currentCard.question}</p>
                </div>
              )}
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="e.g., The answer is incorrect, the question has a typo, outdated information..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </ModalBody>
            <ModalFooter className="border-t border-gray-100 p-4">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={handleReportCard}
                  disabled={isReporting || !reportReason.trim()}
                >
                  {isReporting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};
