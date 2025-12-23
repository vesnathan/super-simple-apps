interface Deck {
  id: string;
  cards: Array<{
    front: string;
    back: string;
  }>;
  title: string;
}

export const updateDeck = async (deck: Deck): Promise<void> => {
  try {
    const response = await fetch(`/api/decks/${deck.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deck),
    });

    if (!response.ok) {
      throw new Error("Failed to update deck");
    }
  } catch (error) {
    throw error;
  }
};
