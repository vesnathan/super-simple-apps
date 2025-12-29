/* eslint-disable no-console */
/**
 * Database seed script - seeds DynamoDB with sample flashcard decks
 * Run with: yarn seed (from backend directory)
 *
 * Note: cardCount is computed by a field resolver from cards.length,
 * so we don't store it in DynamoDB.
 */
import { seedDatabase } from "../utils/dbSeed";

seedDatabase()
  .then(() => {
    console.log("Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
