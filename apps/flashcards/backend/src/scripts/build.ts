/* eslint-disable no-console */
import { mkdir, rm, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import esbuild from "esbuild";
import JSZip from "jszip";

async function zipDirectory(sourcePath: string, outPath: string) {
  const zip = new JSZip();
  const entries = await readdir(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const filePath = join(sourcePath, entry.name);
      const content = await readFile(filePath);

      zip.file(entry.name, content);
    }
  }

  const zipContent = await zip.generateAsync({ type: "nodebuffer" });

  await writeFile(outPath, zipContent);
}

// Handler paths must match deploy.ts exactly
const handlers = {
  getPublicDecks: "./src/handlers/decks/getPublicDecks.ts",
  getUserDecks: "./src/handlers/decks/getUserDecks.ts",
  createDeck: "./src/handlers/decks/createDeck.ts",
  syncUserDeck: "./src/handlers/decks/syncUserDeck.ts",
  updateUserCard: "./src/handlers/cards/updateUserCard.ts",
};

async function build() {
  const distPath = join(__dirname, "../../dist");

  await rm(distPath, { recursive: true, force: true });
  await mkdir(distPath);

  console.log("Building Lambda functions...");
  console.log("Handler files to process:", Object.entries(handlers));

  try {
    // Build each handler separately
    for (const [name, entry] of Object.entries(handlers)) {
      console.log(`Building ${name} from ${entry}...`);

      await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        outfile: join(distPath, `${name}.js`),
        platform: "node",
        target: "node18",
        external: ["aws-sdk"],
        minify: true,
      });

      console.log(`✓ Built ${name}`);
    }

    console.log("\nCreating deployment package...");
    await zipDirectory(distPath, join(distPath, "functions.zip"));
    console.log("✓ Created functions.zip");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
