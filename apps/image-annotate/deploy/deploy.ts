#!/usr/bin/env ts-node

/**
 * Super Simple Apps Image Annotate Deployment Script
 *
 * Uses the shared static app deployer with shared wildcard certificate.
 */

import { config } from "dotenv";
import * as path from "path";
import { Command } from "commander";

// Load environment variables
config({ path: path.resolve(__dirname, "../../../.env") });

import { logger } from "@super-simple-apps/deploy";
import { deployStaticApp, deleteStaticApp } from "../../../deploy/static-app-deployer";

// Parse command line arguments
const program = new Command();
program
  .option("--stage <stage>", "Deployment stage", "prod")
  .option("--remove", "Remove the stack")
  .parse(process.argv);

const options = program.opts();
const STAGE = options.stage || "prod";

async function main() {
  const appConfig = {
    appName: "super-simple-apps-image-annotate",
    subdomain: "annotate",
    appDir: path.resolve(__dirname, ".."),
    stage: STAGE,
  };

  try {
    if (options.remove) {
      await deleteStaticApp(appConfig);
    } else {
      const result = await deployStaticApp(appConfig);
      logger.success(`\nDeployment complete! URL: ${result.websiteUrl}\n`);
    }
  } catch (error) {
    logger.error(`Deployment failed: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();
