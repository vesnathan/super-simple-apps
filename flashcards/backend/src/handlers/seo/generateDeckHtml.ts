/**
 * DynamoDB Stream Handler - Generates static HTML for public decks
 *
 * Triggered when decks are created/updated in DynamoDB.
 * Generates SEO-friendly static HTML pages and uploads to S3.
 */

import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";

const s3Client = new S3Client({});

const FRONTEND_BUCKET = process.env.FRONTEND_BUCKET || "";
const SITE_URL = process.env.SITE_URL || "";
const STAGE = process.env.STAGE || "dev";

interface Card {
  id: string;
  question: string;
  answer: string;
}

interface DeckRecord {
  PK: string;
  SK: string;
  id: string;
  userId: string;
  title: string;
  description?: string;
  cards?: Card[];
  isPublic: string | boolean;
  createdAt: string;
  lastModified: number;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Generate SEO-friendly static HTML for a deck
 */
function generateDeckHtml(deck: DeckRecord): string {
  const title = escapeHtml(deck.title);
  const cardCount = deck.cards?.length || 0;
  const deckUrl = `${SITE_URL}/deck/${deck.id}`;
  const createdDate = new Date(deck.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use description if available, otherwise generate from title
  const description = deck.description
    ? escapeHtml(deck.description)
    : `Study ${title} with ${cardCount} interactive flashcards. Free online flashcard app for effective learning.`;

  // Generate card preview content for SEO
  const cardPreviews = (deck.cards || [])
    .slice(0, 5)
    .map(
      (card) => `
      <div class="card-preview">
        <div class="question"><strong>Q:</strong> ${escapeHtml(card.question)}</div>
        <div class="answer"><strong>A:</strong> ${escapeHtml(card.answer)}</div>
      </div>
    `
    )
    .join("");

  const remainingCards = cardCount > 5 ? cardCount - 5 : 0;

  // Generate structured data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: deck.title,
    description: deck.description || `Flashcard deck with ${cardCount} cards. Study ${deck.title} with interactive flashcards.`,
    educationalLevel: "All levels",
    learningResourceType: "Flashcards",
    numberOfItems: cardCount,
    dateCreated: deck.createdAt,
    url: deckUrl,
    provider: {
      "@type": "Organization",
      name: "Super Simple Flashcards",
      url: SITE_URL,
    },
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Flashcard Deck | Super Simple Flashcards</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="flashcards, ${title}, study, learning, education, memorization">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${deckUrl}">
  <meta property="og:title" content="${title} - Flashcard Deck">
  <meta property="og:description" content="${description}">
  <meta property="og:site_name" content="Super Simple Flashcards">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} - Flashcard Deck">
  <meta name="twitter:description" content="${description}">

  <!-- Canonical URL -->
  <link rel="canonical" href="${deckUrl}">

  <!-- Structured Data -->
  <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
  </script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .meta { opacity: 0.9; font-size: 0.9rem; }
    .content { padding: 2rem; }
    .stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .stat {
      text-align: center;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
      min-width: 120px;
    }
    .stat-value { font-size: 2rem; font-weight: bold; color: #3b82f6; }
    .stat-label { font-size: 0.85rem; color: #64748b; }
    .cta {
      text-align: center;
      margin: 2rem 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
    }
    .cards-section { margin-top: 2rem; }
    .cards-section h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #374151;
    }
    .card-preview {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      border-left: 4px solid #3b82f6;
    }
    .question { margin-bottom: 0.5rem; color: #1e3a8a; }
    .answer { color: #059669; }
    .more-cards {
      text-align: center;
      color: #64748b;
      font-style: italic;
      margin-top: 1rem;
    }
    .footer {
      text-align: center;
      padding: 1.5rem;
      background: #f8fafc;
      color: #64748b;
      font-size: 0.85rem;
    }
    .footer a { color: #3b82f6; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <p class="meta">Created ${createdDate}</p>
    </div>

    <div class="content">
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${cardCount}</div>
          <div class="stat-label">Flashcards</div>
        </div>
        <div class="stat">
          <div class="stat-value">Free</div>
          <div class="stat-label">No signup required</div>
        </div>
      </div>

      <div class="cta">
        <a href="${SITE_URL}?id=${deck.id}" class="cta-button">
          Start Studying Now
        </a>
      </div>

      ${
        cardCount > 0
          ? `
      <div class="cards-section">
        <h2>Preview Cards</h2>
        ${cardPreviews}
        ${remainingCards > 0 ? `<p class="more-cards">+ ${remainingCards} more cards in this deck</p>` : ""}
      </div>
      `
          : ""
      }
    </div>

    <div class="footer">
      <p>
        <a href="${SITE_URL}">Super Simple Flashcards</a> -
        Free online flashcard app for effective learning
      </p>
      <p style="margin-top: 0.5rem;">
        <a href="${SITE_URL}/privacy">Privacy Policy</a> |
        <a href="${SITE_URL}/terms">Terms of Service</a> |
        <a href="${SITE_URL}/about">About</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Process a single DynamoDB record
 */
async function processRecord(record: DynamoDBRecord): Promise<void> {
  const eventName = record.eventName;

  // Handle DELETE - remove static HTML
  if (eventName === "REMOVE" && record.dynamodb?.OldImage) {
    const oldItem = unmarshall(
      record.dynamodb.OldImage as Record<string, AttributeValue>
    ) as DeckRecord;

    // Only process deck items (not other item types)
    if (!oldItem.PK?.startsWith("DECK#")) {
      return;
    }

    const wasPublic = oldItem.isPublic === "true" || oldItem.isPublic === true;

    if (wasPublic) {
      console.log(`Deleting static HTML for deck: ${oldItem.id}`);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: FRONTEND_BUCKET,
          Key: `deck/${oldItem.id}/index.html`,
        })
      );
    }
    return;
  }

  // Handle INSERT or MODIFY
  if ((eventName === "INSERT" || eventName === "MODIFY") && record.dynamodb?.NewImage) {
    const newItem = unmarshall(
      record.dynamodb.NewImage as Record<string, AttributeValue>
    ) as DeckRecord;

    // Only process deck items
    if (!newItem.PK?.startsWith("DECK#")) {
      return;
    }

    const isPublic = newItem.isPublic === "true" || newItem.isPublic === true;

    // Check if deck was previously public (for MODIFY events)
    let wasPublic = false;
    if (eventName === "MODIFY" && record.dynamodb?.OldImage) {
      const oldItem = unmarshall(
        record.dynamodb.OldImage as Record<string, AttributeValue>
      ) as DeckRecord;
      wasPublic = oldItem.isPublic === "true" || oldItem.isPublic === true;
    }

    if (isPublic) {
      // Generate and upload static HTML
      console.log(`Generating static HTML for public deck: ${newItem.id}`);
      const html = generateDeckHtml(newItem);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: FRONTEND_BUCKET,
          Key: `deck/${newItem.id}/index.html`,
          Body: html,
          ContentType: "text/html",
          CacheControl: "public, max-age=3600", // 1 hour cache
        })
      );
      console.log(`Static HTML uploaded for deck: ${newItem.id}`);
    } else if (wasPublic && !isPublic) {
      // Deck was made private - delete static HTML
      console.log(`Deck ${newItem.id} made private, deleting static HTML`);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: FRONTEND_BUCKET,
          Key: `deck/${newItem.id}/index.html`,
        })
      );
    }
  }
}

/**
 * Main handler - processes DynamoDB Stream events
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`Processing ${event.Records.length} records from DynamoDB Stream`);

  const results = await Promise.allSettled(
    event.Records.map((record) => processRecord(record))
  );

  // Log any failures
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    console.error(`${failures.length} records failed to process:`, failures);
  }

  console.log(
    `Processed ${results.length - failures.length}/${results.length} records successfully`
  );
};
