/**
 * Post-build script to:
 * 1. Inject AdSense script tag directly into HTML files
 * 2. Remove noindex meta tag for SEO
 * 3. Add Open Graph and Twitter Card meta tags
 *
 * This is needed because Next.js App Router with static export doesn't render
 * script tags in the head directly - they go into the RSC payload.
 * Google's crawler can't parse the RSC payload, so we inject it manually.
 */

const fs = require("fs");
const path = require("path");

const ADSENSE_CLIENT = "ca-pub-6030709852460281";
const ADSENSE_SCRIPT = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`;

const SITE_URL = "https://www.super-simple-flashcards.com";
const SEO_TAGS = `
<meta name="robots" content="index, follow"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${SITE_URL}/"/>
<meta property="og:title" content="Super Simple Flashcards - Free Online Flashcard App"/>
<meta property="og:description" content="Create, study, and share flashcards for free. Simple, fast, and effective learning tool for students and educators."/>
<meta property="og:image" content="${SITE_URL}/og-image.svg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:site_name" content="Super Simple Flashcards"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Super Simple Flashcards - Free Online Flashcard App"/>
<meta name="twitter:description" content="Create, study, and share flashcards for free. Simple, fast, and effective learning tool for students and educators."/>
<meta name="twitter:image" content="${SITE_URL}/og-image.svg"/>
<link rel="canonical" href="${SITE_URL}/"/>
`;

const outDir = path.join(__dirname, "../out");

function injectIntoHtmlFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      injectIntoHtmlFiles(filePath);
    } else if (file.endsWith(".html")) {
      let content = fs.readFileSync(filePath, "utf8");
      let modified = false;

      // Remove noindex meta tag
      if (content.includes('<meta name="robots" content="noindex"/>')) {
        content = content.replace('<meta name="robots" content="noindex"/>', '');
        console.log(`Removed noindex from ${filePath}`);
        modified = true;
      }

      // Inject AdSense if not already present
      if (!content.includes(ADSENSE_SCRIPT)) {
        content = content.replace("<head>", `<head>\n${ADSENSE_SCRIPT}`);
        console.log(`Injected AdSense into ${filePath}`);
        modified = true;
      }

      // Inject SEO tags if not already present
      if (!content.includes('og:title')) {
        content = content.replace("</head>", `${SEO_TAGS}</head>`);
        console.log(`Injected SEO tags into ${filePath}`);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

console.log("Processing HTML files...");
injectIntoHtmlFiles(outDir);
console.log("Done!");
