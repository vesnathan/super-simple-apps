/**
 * Report Notification Handler
 *
 * Triggered by DynamoDB Streams when a card is reported.
 * All reports are sent to the admin email for review.
 */

import { DynamoDBStreamEvent, DynamoDBRecord } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Environment variables
const REGION = process.env.AWS_REGION || "ap-southeast-2";
const STAGE = process.env.STAGE || "dev";
const TABLE_NAME = process.env.TABLE_NAME || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "";

// AWS Clients
const dynamoClient = new DynamoDBClient({ region: REGION });
const sesClient = new SESClient({ region: REGION });

// System user ID for system decks
const SYSTEM_USER_ID = "system";

interface ReportItem {
  id: string;
  deckId: string;
  cardId: string;
  reason: string;
  createdAt: string;
  status: string;
  reporterId?: string;
}

interface DeckItem {
  id: string;
  userId: string;
  title: string;
  cards: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

interface CardInfo {
  question: string;
  answer: string;
}

/**
 * Get deck details from DynamoDB
 */
async function getDeck(deckId: string): Promise<DeckItem | null> {
  const result = await dynamoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: { S: `DECK#${deckId}` },
        SK: { S: `DECK#${deckId}` },
      },
    })
  );

  if (!result.Item) {
    return null;
  }

  const item = unmarshall(result.Item as Record<string, AttributeValue>);
  return item as DeckItem;
}

/**
 * Find card details from deck
 */
function findCard(deck: DeckItem, cardId: string): CardInfo | null {
  const card = deck.cards?.find((c) => c.id === cardId);
  if (!card) {
    return null;
  }
  return {
    question: card.question,
    answer: card.answer,
  };
}

/**
 * Escape HTML special characters
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
 * Send notification email to admin
 */
async function sendNotificationEmail(
  report: ReportItem,
  deck: DeckItem,
  card: CardInfo | null
): Promise<void> {
  if (!FROM_EMAIL || !ADMIN_EMAIL) {
    console.warn("FROM_EMAIL or ADMIN_EMAIL not configured, logging report instead");
    console.log("Report notification:", JSON.stringify({ report, deck, card }, null, 2));
    return;
  }

  const isSystemDeck = deck.userId === SYSTEM_USER_ID;
  const deckType = isSystemDeck ? "System Deck" : "User Deck";

  const subject = `[Flashcards] Card Reported in ${deckType}: ${deck.title}`;

  const cardContent = card
    ? `
Card Details:
  Question: ${card.question}
  Answer: ${card.answer}
`
    : `Card ID: ${report.cardId} (card not found in deck)`;

  const emailBody = `
A card has been reported.

Deck Type: ${deckType}
Deck: ${deck.title}
Deck ID: ${report.deckId}
Deck Owner: ${deck.userId}

${cardContent}

Report Reason:
${report.reason}

Reported at: ${report.createdAt}
Report ID: ${report.id}

---
Admin notification from Super Simple Flashcards (${STAGE})
Review at: https://flashcards.super-simple-apps.com/admin/reports
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
    .value { margin-top: 4px; }
    .card-preview { background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 8px; }
    .card-question { font-weight: 600; color: #1e40af; }
    .card-answer { color: #059669; margin-top: 8px; }
    .reason { background: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626; white-space: pre-wrap; }
    .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .badge-system { background: #dbeafe; color: #1e40af; }
    .badge-user { background: #fef3c7; color: #92400e; }
    .action-btn { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">Card Reported</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Deck</div>
        <div class="value">
          ${escapeHtml(deck.title)}
          <span class="badge ${isSystemDeck ? "badge-system" : "badge-user"}">${deckType}</span>
        </div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Owner: ${escapeHtml(deck.userId)}</div>
      </div>

      <div class="field">
        <div class="label">Reported Card</div>
        ${
          card
            ? `
        <div class="card-preview">
          <div class="card-question">Q: ${escapeHtml(card.question)}</div>
          <div class="card-answer">A: ${escapeHtml(card.answer)}</div>
        </div>
        `
            : `<div class="value">Card ID: ${escapeHtml(report.cardId)} (not found)</div>`
        }
      </div>

      <div class="field">
        <div class="label">Report Reason</div>
        <div class="reason">${escapeHtml(report.reason)}</div>
      </div>

      <div class="field">
        <div class="label">Report Details</div>
        <div class="value">
          Report ID: ${escapeHtml(report.id)}<br>
          Reported at: ${escapeHtml(report.createdAt)}
        </div>
      </div>

      <a href="https://flashcards.super-simple-apps.com/admin/reports" class="action-btn">Review Reports</a>

      <div class="footer">
        Admin notification from Super Simple Flashcards (${STAGE})
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  await sesClient.send(
    new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [ADMIN_EMAIL],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: "UTF-8",
          },
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
        },
      },
    })
  );

  console.log(`Report notification sent to admin: ${ADMIN_EMAIL}`);
}

/**
 * Process a single report record from DynamoDB Stream
 */
async function processReport(record: DynamoDBRecord): Promise<void> {
  // Only process INSERT events (new reports)
  if (record.eventName !== "INSERT") {
    return;
  }

  const newImage = record.dynamodb?.NewImage;
  if (!newImage) {
    console.warn("No NewImage in record");
    return;
  }

  // Unmarshall the DynamoDB item
  const report = unmarshall(newImage as Record<string, AttributeValue>) as ReportItem;

  console.log(`Processing report for deck ${report.deckId}, card ${report.cardId}`);

  // Get the deck to find details
  const deck = await getDeck(report.deckId);
  if (!deck) {
    console.error(`Deck not found: ${report.deckId}`);
    return;
  }

  // Find the card in the deck
  const card = findCard(deck, report.cardId);

  // Send notification to admin
  await sendNotificationEmail(report, deck, card);
}

/**
 * Lambda handler
 */
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log(`Processing ${event.Records.length} records`);

  for (const record of event.Records) {
    try {
      await processReport(record);
    } catch (error) {
      console.error("Error processing report:", error);
      // Continue processing other records even if one fails
    }
  }
};
