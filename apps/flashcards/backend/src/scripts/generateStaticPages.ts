/**
 * Pre-generate static HTML pages for all public decks
 *
 * This script queries DynamoDB for all public decks and generates
 * SEO-friendly static HTML pages, uploading them to S3.
 *
 * Usage: STAGE=prod npx tsx src/scripts/generateStaticPages.ts
 */
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const STAGE = process.env.STAGE || "prod";
const TABLE_NAME = `flashcards-${STAGE}-data`;
const FRONTEND_BUCKET = `simple-flashcards-frontend-${STAGE}`;
const SITE_URL =
  STAGE === "prod"
    ? "https://super-simple-flashcards.com"
    : `https://d2ky7l37rpw6un.cloudfront.net`;

console.log(`Stage: ${STAGE}`);
console.log(`Table: ${TABLE_NAME}`);
console.log(`Bucket: ${FRONTEND_BUCKET}`);
console.log(`Site URL: ${SITE_URL}`);
console.log("");

const ddb = DynamoDBDocument.from(
  new DynamoDBClient({
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
);

const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

interface Card {
  id: string;
  question: string;
  answer: string;
}

interface DeckRecord {
  id: string;
  userId: string;
  title: string;
  description?: string;
  tags?: string[];
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

  // Generate ALL card content for SEO (Google should index all questions/answers)
  const allCardPreviews = (deck.cards || [])
    .map(
      (card, index) => `
      <div class="card-preview" itemscope itemtype="https://schema.org/Question">
        <div class="card-number">${index + 1}</div>
        <div class="question" itemprop="name"><strong>Q:</strong> ${escapeHtml(card.question)}</div>
        <div class="answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
          <span itemprop="text"><strong>A:</strong> ${escapeHtml(card.answer)}</span>
        </div>
      </div>
    `
    )
    .join("");

  // Generate tag badges
  const tagBadges = (deck.tags || [])
    .map(
      (tag) => `<span class="tag">${escapeHtml(tag.replace(/-/g, ' '))}</span>`
    )
    .join("");

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
    keywords: deck.tags?.map(tag => tag.replace(/-/g, ' ')) || [],
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
    .description {
      max-width: 600px;
      margin: 1rem auto 0;
      opacity: 0.95;
      font-size: 1rem;
      line-height: 1.5;
    }
    .meta { opacity: 0.9; font-size: 0.9rem; margin-top: 0.5rem; }
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
      position: relative;
    }
    .card-number {
      position: absolute;
      top: 0.5rem;
      right: 0.75rem;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }
    .question { margin-bottom: 0.5rem; color: #1e3a8a; }
    .answer { color: #059669; }
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
      justify-content: center;
    }
    .tag {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      text-transform: capitalize;
    }
    .cards-list {
      max-height: 600px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }
    .cards-list::-webkit-scrollbar { width: 6px; }
    .cards-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
    .cards-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .cards-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
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
      ${deck.description ? `<p class="description">${description}</p>` : ""}
      ${tagBadges ? `<div class="tags-container">${tagBadges}</div>` : ""}
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
        <h2>All ${cardCount} Cards in This Deck</h2>
        <div class="cards-list">
          ${allCardPreviews}
        </div>
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
 * Query all public decks from DynamoDB
 */
async function getPublicDecks(): Promise<DeckRecord[]> {
  const decks: DeckRecord[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const result = await ddb.query({
      TableName: TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      ExpressionAttributeValues: { ":pk": "PUBLIC" },
      ExclusiveStartKey: lastEvaluatedKey,
    });

    if (result.Items) {
      decks.push(...(result.Items as DeckRecord[]));
    }
    lastEvaluatedKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastEvaluatedKey);

  return decks;
}

/**
 * Generate and upload static HTML for a single deck
 */
async function generateStaticPage(deck: DeckRecord): Promise<void> {
  const html = generateDeckHtml(deck);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: FRONTEND_BUCKET,
      Key: `deck/${deck.id}/index.html`,
      Body: html,
      ContentType: "text/html",
      CacheControl: "public, max-age=3600", // 1 hour cache
    })
  );
}

/**
 * Main function - generate static pages for all public decks
 */
async function main() {
  console.log("Fetching public decks from DynamoDB...");
  const decks = await getPublicDecks();
  console.log(`Found ${decks.length} public decks\n`);

  let success = 0;
  let failed = 0;

  for (const deck of decks) {
    try {
      await generateStaticPage(deck);
      console.log(`✓ ${deck.title} (${deck.cards?.length || 0} cards)`);
      success++;
    } catch (error) {
      console.error(`✗ Failed: ${deck.title}`, error);
      failed++;
    }
  }

  console.log("");
  console.log(`✓ Generated ${success} static pages`);
  if (failed > 0) {
    console.log(`✗ Failed: ${failed}`);
  }

  // Generate sitemap with all deck URLs
  console.log("\nGenerating sitemap...");
  await generateSitemap(decks);
  console.log("✓ Sitemap generated");
}

/**
 * Generate sitemap.xml with all deck URLs
 */
async function generateSitemap(decks: DeckRecord[]): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/about", changefreq: "monthly", priority: "0.8" },
    { loc: "/contact", changefreq: "monthly", priority: "0.7" },
    { loc: "/privacy", changefreq: "monthly", priority: "0.5" },
    { loc: "/terms", changefreq: "monthly", priority: "0.5" },
  ];

  const deckUrls = decks.map((deck) => ({
    loc: `/deck/${deck.id}`,
    lastmod: new Date(deck.lastModified).toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "0.9",
  }));

  const allUrls = [...staticPages.map((p) => ({ ...p, lastmod: today })), ...deckUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: FRONTEND_BUCKET,
      Key: "sitemap.xml",
      Body: sitemap,
      ContentType: "application/xml",
      CacheControl: "public, max-age=86400", // 24 hour cache
    })
  );
}

main().catch(console.error);
