import { Context } from "@aws-appsync/utils";

/** Source Deck with cards array */
interface DeckSource {
  cards?: Array<{ id: string; question: string; answer: string }>;
}

type CTX = Context<object, object, DeckSource, object, null>;

/**
 * Field resolver for Deck.cardCount
 * Returns the count of cards in the deck
 */
export function request(ctx: CTX) {
  return {};
}

export function response(ctx: CTX): number {
  const deck = ctx.source as DeckSource | undefined;
  const cards = deck?.cards ?? [];
  return cards.length;
}
