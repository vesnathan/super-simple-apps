/**
 * Seed database utility
 * Spawns the per-package seeder script with appropriate environment variables
 */

import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { logger } from "./logger";

export interface SeedDBOptions {
  region: string;
  tableName: string;
  stage: string;
  skipConfirmation?: boolean;
  dryRun?: boolean;
  force?: boolean;
}

export async function seedDB(options: SeedDBOptions): Promise<void> {
  const {
    region,
    tableName,
    stage,
    skipConfirmation = true, // Default to skip for automated deployment
    dryRun = false,
    force = false,
  } = options;

  logger.info("Seeding database...");
  logger.info(`  Region: ${region}`);
  logger.info(`  Table: ${tableName}`);
  logger.info(`  Stage: ${stage}`);

  if (!skipConfirmation) {
    logger.warning("This will create test data in your DynamoDB table.");
    logger.warning("Press Ctrl+C to cancel, or wait 5 seconds to continue...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // Resolve seeder script path
  const candidates = [
    "../../backend/scripts/seed-db.ts",
    "../../backend/scripts/seed.ts",
  ];

  let scriptPath: string | null = null;
  for (const rel of candidates) {
    const abs = path.resolve(__dirname, rel);
    if (fs.existsSync(abs)) {
      scriptPath = abs;
      break;
    }
  }

  if (!scriptPath) {
    const tried = candidates.map((c) => path.resolve(__dirname, c)).join("\n");
    throw new Error(`No seed script found. Tried:\n${tried}`);
  }

  logger.info(`  Using seeder: ${scriptPath}`);

  const env = {
    ...process.env,
    AWS_REGION: region,
    TABLE_NAME: tableName,
    STAGE: stage,
  };

  const args: string[] = [scriptPath];
  if (force) {
    args.push("--force");
  }

  if (dryRun) {
    logger.info("Dry-run enabled: not spawning tsx.");
    logger.info(`Would run: tsx ${args.map((a) => JSON.stringify(a)).join(" ")}`);
    return;
  }

  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const tsxProcess = spawn("tsx", args, {
      env,
      stdio: ["inherit", "pipe", "pipe"],
    });

    tsxProcess.stdout?.on("data", (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    tsxProcess.stderr?.on("data", (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    tsxProcess.on("close", (code) => {
      if (code === 0) {
        logger.success("Database seeding completed");
        resolve();
      } else {
        logger.error(`Seed process exited with code ${code}`);
        reject(new Error(`Seed failed with code ${code}`));
      }
    });

    tsxProcess.on("error", (error) => {
      logger.error(`Failed to start seed process: ${error.message}`);
      reject(error);
    });
  });
}
