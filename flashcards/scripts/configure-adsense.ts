#!/usr/bin/env npx tsx

/**
 * Configure Google AdSense Credentials
 *
 * This script updates the AdSense configuration in the frontend environment.
 * It modifies deployment-outputs.json to include AdSense credentials that will
 * be picked up at build time by next.config.js.
 *
 * Usage:
 *   npx tsx scripts/configure-adsense.ts --client ca-pub-1234567890 --slot 9876543210 --enable
 *   npx tsx scripts/configure-adsense.ts --disable
 *   npx tsx scripts/configure-adsense.ts --show
 *
 * Options:
 *   --client <id>   Your AdSense Publisher ID (ca-pub-XXXXXXXXXX)
 *   --slot <id>     Your AdSense Ad Slot ID
 *   --enable        Enable ads
 *   --disable       Disable ads
 *   --show          Show current configuration
 */

import * as fs from "fs";
import * as path from "path";

const OUTPUTS_FILE = path.join(__dirname, "../deploy/deployment-outputs.json");

interface DeploymentOutputs {
  adsense?: {
    client: string;
    slot: string;
    enabled: boolean;
  };
  [key: string]: unknown;
}

function loadOutputs(): DeploymentOutputs {
  if (fs.existsSync(OUTPUTS_FILE)) {
    const content = fs.readFileSync(OUTPUTS_FILE, "utf-8");
    return JSON.parse(content) as DeploymentOutputs;
  }
  return {};
}

function saveOutputs(outputs: DeploymentOutputs): void {
  fs.writeFileSync(OUTPUTS_FILE, JSON.stringify(outputs, null, 2));
}

function showConfig(outputs: DeploymentOutputs): void {
  console.log("\nCurrent AdSense Configuration:");
  console.log("================================");
  if (outputs.adsense) {
    console.log(`  Client ID: ${outputs.adsense.client || "(not set)"}`);
    console.log(`  Slot ID:   ${outputs.adsense.slot || "(not set)"}`);
    console.log(`  Enabled:   ${outputs.adsense.enabled ? "Yes" : "No"}`);
  } else {
    console.log("  (not configured)");
  }
  console.log("");
}

function main(): void {
  const args = process.argv.slice(2);
  const outputs = loadOutputs();

  // Initialize adsense config if not present
  if (!outputs.adsense) {
    outputs.adsense = {
      client: "",
      slot: "",
      enabled: false,
    };
  }

  // Show current config
  if (args.includes("--show") || args.length === 0) {
    showConfig(outputs);
    if (args.length === 0) {
      console.log("Usage:");
      console.log("  npx tsx scripts/configure-adsense.ts --client ca-pub-XXXX --slot XXXX --enable");
      console.log("  npx tsx scripts/configure-adsense.ts --disable");
      console.log("  npx tsx scripts/configure-adsense.ts --show");
    }
    return;
  }

  // Process arguments
  let hasChanges = false;

  const clientIndex = args.indexOf("--client");
  if (clientIndex !== -1 && args[clientIndex + 1]) {
    const clientId = args[clientIndex + 1];
    if (!clientId.startsWith("ca-pub-")) {
      console.error("Error: Client ID must start with 'ca-pub-'");
      process.exit(1);
    }
    outputs.adsense.client = clientId;
    hasChanges = true;
    console.log(`  Set client ID: ${clientId}`);
  }

  const slotIndex = args.indexOf("--slot");
  if (slotIndex !== -1 && args[slotIndex + 1]) {
    outputs.adsense.slot = args[slotIndex + 1];
    hasChanges = true;
    console.log(`  Set slot ID: ${outputs.adsense.slot}`);
  }

  if (args.includes("--enable")) {
    outputs.adsense.enabled = true;
    hasChanges = true;
    console.log("  Enabled ads");
  }

  if (args.includes("--disable")) {
    outputs.adsense.enabled = false;
    hasChanges = true;
    console.log("  Disabled ads");
  }

  if (hasChanges) {
    saveOutputs(outputs);
    console.log("\nConfiguration saved to deployment-outputs.json");
    console.log("Run 'yarn deploy:dev' or 'yarn build:frontend' to apply changes.\n");
  }

  showConfig(outputs);
}

main();
