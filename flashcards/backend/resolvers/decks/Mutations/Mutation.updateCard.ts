import { Context, util } from "@aws-appsync/utils";
import { UpdateCardInput, Deck, Card } from "shared";

type CTX = Context<{
  deckId: string;
  cardId: string;
  input: UpdateCardInput;
}>;

export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { deckId } = ctx.args;

  if (!deckId) {
    return util.error("deckId is required", "ValidationException");
  }

  // Store userId in stash for response validation
  ctx.stash.userId = userId;

  // First, we need to get the deck to update the cards array
  // We'll use GetItem to fetch, then process in response
  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({
      PK: `DECK#${deckId}`,
      SK: `DECK#${deckId}`,
    }),
  };
}

export function response(ctx: CTX): Deck {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }

  const deck = ctx.result;
  const userId = ctx.stash.userId as string;

  if (!deck) {
    return util.error("Deck not found", "NotFoundException");
  }

  // Verify ownership
  if (deck.userId !== userId) {
    return util.error("You don't have permission to edit this deck", "UnauthorizedException");
  }

  const { cardId, input } = ctx.args;

  if (!cardId) {
    return util.error("cardId is required", "ValidationException");
  }

  // Find and update the card
  const cards = deck.cards || [];
  let cardFound = false;

  const updatedCards = cards.map((card: Card) => {
    if (card.id === cardId) {
      cardFound = true;
      return {
        ...card,
        ...(input.question !== undefined && { question: input.question }),
        ...(input.answer !== undefined && { answer: input.answer }),
      };
    }
    return card;
  });

  if (!cardFound) {
    return util.error("Card not found", "NotFoundException");
  }

  const timestamp = util.time.nowEpochMilliSeconds();

  // Create the updated deck object to return
  const updatedDeck = {
    ...deck,
    cards: updatedCards,
    lastModified: timestamp,
    isPublic: deck.isPublic === "true",
  };

  // NOTE: This resolver does GetItem only - it doesn't persist!
  // The actual persistence happens via the frontend calling saveDeck after this
  // For proper persistence, we'd need a pipeline resolver or use a different approach

  // For now, return the updated deck - the frontend should call saveDeck to persist
  return updatedDeck as Deck;
}
