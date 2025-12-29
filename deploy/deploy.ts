#!/usr/bin/env ts-node

/**
 * Super Simple Apps - Root Deployment Script
 *
 * Provides a menu-driven interface for deploying all apps or individual stacks.
 *
 * Usage:
 *   yarn deploy              # Interactive menu
 *   yarn deploy --all        # Deploy all apps
 *   yarn deploy --app=landing
 *   yarn deploy --shared     # Deploy shared infrastructure only
 *   yarn deploy --remove     # Remove stacks
 */

import { config } from "dotenv";
import * as path from "path";
import { execSync, spawn } from "child_process";
import { Command } from "commander";
import * as readline from "readline";

// Load environment variables
config({ path: path.resolve(__dirname, "../.env") });

import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";

import { logger, setLogFile, closeLogFile } from "@super-simple-apps/deploy";
import {
  deployStaticApp,
  deleteStaticApp,
  getStaticAppInfo,
  buildAndUploadFrontend,
  invalidateCloudFront,
  getSharedCertificateArn,
} from "./static-app-deployer";

const REGION = process.env.AWS_REGION || "ap-southeast-2";

// App definitions
const APPS = {
  shared: {
    name: "Shared Infrastructure",
    type: "shared",
    deployScript: path.resolve(__dirname, "../shared-infra/deploy.ts"),
  },
  flashcards: {
    name: "Flashcards",
    type: "full",
    appDir: path.resolve(__dirname, "../apps/flashcards"),
    subdomain: "flashcards",
    deployScript: path.resolve(__dirname, "../apps/flashcards/deploy/deploy.ts"),
  },
  crm: {
    name: "CRM",
    type: "full",
    appDir: path.resolve(__dirname, "../apps/crm"),
    subdomain: "crm",
    deployScript: path.resolve(__dirname, "../apps/crm/deploy/deploy.ts"),
  },
  invoice: {
    name: "Invoice",
    type: "full",
    appDir: path.resolve(__dirname, "../apps/invoice"),
    subdomain: "invoice",
    deployScript: path.resolve(__dirname, "../apps/invoice/deploy/deploy.ts"),
  },
  landing: {
    name: "Landing Page",
    type: "static",
    appDir: path.resolve(__dirname, "../apps/landing"),
    subdomain: "", // root domain
    appName: "super-simple-landing",
  },
  "image-crop": {
    name: "Image Crop",
    type: "static",
    appDir: path.resolve(__dirname, "../apps/image-crop"),
    subdomain: "crop",
    appName: "super-simple-image-crop",
  },
  "image-resize": {
    name: "Image Resize",
    type: "static",
    appDir: path.resolve(__dirname, "../apps/image-resize"),
    subdomain: "resize",
    appName: "super-simple-image-resize",
  },
  "image-annotate": {
    name: "Image Annotate",
    type: "static",
    appDir: path.resolve(__dirname, "../apps/image-annotate"),
    subdomain: "annotate",
    appName: "super-simple-image-annotate",
  },
  "job-timer": {
    name: "Job Timer",
    type: "static",
    appDir: path.resolve(__dirname, "../apps/job-timer"),
    subdomain: "job-timer",
    appName: "super-simple-apps-job-timer",
  },
} as const;

type AppKey = keyof typeof APPS;

interface MenuItem {
  key: string;
  label: string;
  action: () => Promise<void>;
}

// Parse command line arguments
const program = new Command();
program
  .option("--stage <stage>", "Deployment stage", "dev")
  .option("--all", "Deploy all apps")
  .option("--shared", "Deploy shared infrastructure only")
  .option("--app <app>", "Deploy specific app")
  .option("--remove", "Remove stacks")
  .option("--build-only <app>", "Build and upload frontend only (no infra changes)")
  .option("--invalidate <app>", "Invalidate CloudFront only")
  .parse(process.argv);

const options = program.opts();
const STAGE = options.stage || "prod";

function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function prompt(question: string): Promise<string> {
  const rl = createReadlineInterface();
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function runDeployScript(scriptPath: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", scriptPath, ...args], {
      stdio: "inherit",
      cwd: path.dirname(scriptPath),
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Deploy script exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

async function deployShared(): Promise<void> {
  logger.info("\n🚀 Deploying Shared Infrastructure...\n");
  await runDeployScript(APPS.shared.deployScript, [STAGE]);
}

async function deployFlashcards(): Promise<void> {
  logger.info("\n🚀 Deploying Flashcards...\n");
  await runDeployScript(APPS.flashcards.deployScript, ["--stage", STAGE]);
}

async function deployCRM(): Promise<void> {
  logger.info("\n🚀 Deploying CRM...\n");
  await runDeployScript(APPS.crm.deployScript, ["--stage", STAGE]);
}

async function deployInvoice(): Promise<void> {
  logger.info("\n🚀 Deploying Invoice...\n");
  await runDeployScript(APPS.invoice.deployScript, ["--stage", STAGE]);
}

async function deployStaticAppByKey(appKey: AppKey): Promise<void> {
  const app = APPS[appKey];
  if (app.type !== "static") {
    throw new Error(`${appKey} is not a static app`);
  }

  logger.info(`\n🚀 Deploying ${app.name}...\n`);

  await deployStaticApp({
    appName: app.appName,
    subdomain: app.subdomain,
    appDir: app.appDir,
    stage: STAGE,
    region: REGION,
  });
}

async function deployAll(): Promise<void> {
  logger.info("\n🚀 Deploying All Apps...\n");

  // 1. Shared infrastructure first
  logger.info("\n--- Step 1/9: Shared Infrastructure ---");
  await deployShared();

  // 2. Flashcards (complex app)
  logger.info("\n--- Step 2/9: Flashcards ---");
  await deployFlashcards();

  // 3. CRM (complex app)
  logger.info("\n--- Step 3/9: CRM ---");
  await deployCRM();

  // 4. Invoice (complex app)
  logger.info("\n--- Step 4/9: Invoice ---");
  await deployInvoice();

  // 5-9. Static apps
  const staticApps: AppKey[] = ["landing", "image-crop", "image-resize", "image-annotate", "job-timer"];

  for (let i = 0; i < staticApps.length; i++) {
    const appKey = staticApps[i];
    logger.info(`\n--- Step ${i + 5}/${staticApps.length + 4}: ${APPS[appKey].name} ---`);
    await deployStaticAppByKey(appKey);
  }

  logger.success("\n✅ All apps deployed successfully!\n");
}

async function removeApp(appKey: AppKey): Promise<void> {
  const app = APPS[appKey];

  if (app.type === "static") {
    await deleteStaticApp({
      appName: app.appName,
      subdomain: app.subdomain,
      appDir: app.appDir,
      stage: STAGE,
      region: REGION,
    });
  } else {
    logger.warning(`Removal of ${app.name} requires manual intervention (complex app)`);
    logger.info("Stacks to delete:");
    if (appKey === "flashcards") {
      logger.info("  - simple-flashcards-lambdas-" + STAGE);
      logger.info("  - simple-flashcards-frontend-" + STAGE);
      logger.info("  - simple-flashcards-appsync-" + STAGE);
      logger.info("  - simple-flashcards-dynamodb-" + STAGE);
      logger.info("  - simple-flashcards-cognito-" + STAGE);
      logger.info("  - simple-flashcards-dns-" + STAGE + " (us-east-1)");
    }
  }
}

async function buildAndUploadOnly(appKey: AppKey): Promise<void> {
  const app = APPS[appKey];

  if (app.type === "shared") {
    logger.error("Shared infrastructure has no frontend to build");
    return;
  }

  logger.info(`\n🔨 Building and uploading ${app.name}...\n`);

  // Get current stack outputs
  const cfnClient = new CloudFormationClient({ region: REGION });
  const stackName = app.type === "static"
    ? `${app.appName}-${STAGE}`
    : `simple-flashcards-frontend-${STAGE}`;

  try {
    const response = await cfnClient.send(
      new DescribeStacksCommand({ StackName: stackName })
    );
    const outputs = response.Stacks?.[0]?.Outputs;

    const bucketName = outputs?.find((o) => o.OutputKey === "WebsiteBucket")?.OutputValue;
    const distributionId = outputs?.find((o) => o.OutputKey === "CloudFrontDistributionId")?.OutputValue;

    if (!bucketName) {
      throw new Error("Could not find WebsiteBucket in stack outputs. Deploy the stack first.");
    }

    const cfClient = new CloudFrontClient({ region: REGION });

    await buildAndUploadFrontend(
      app.appDir,
      bucketName,
      distributionId || "",
      STAGE,
      REGION,
      distributionId ? cfClient : undefined
    );

    logger.success(`\n✅ ${app.name} built and uploaded successfully!\n`);
  } catch (error) {
    if (error instanceof Error && error.message?.includes("does not exist")) {
      logger.error(`Stack ${stackName} does not exist. Deploy the app first.`);
    } else {
      throw error;
    }
  }
}

async function invalidateOnly(appKey: AppKey): Promise<void> {
  const app = APPS[appKey];

  if (app.type === "shared") {
    logger.error("Shared infrastructure has no CloudFront distribution");
    return;
  }

  logger.info(`\n🔄 Invalidating CloudFront for ${app.name}...\n`);

  const cfnClient = new CloudFormationClient({ region: REGION });
  const stackName = app.type === "static"
    ? `${app.appName}-${STAGE}`
    : `simple-flashcards-frontend-${STAGE}`;

  try {
    const response = await cfnClient.send(
      new DescribeStacksCommand({ StackName: stackName })
    );
    const distributionId = response.Stacks?.[0]?.Outputs?.find(
      (o) => o.OutputKey === "CloudFrontDistributionId"
    )?.OutputValue;

    if (!distributionId) {
      throw new Error("Could not find CloudFrontDistributionId in stack outputs");
    }

    const cfClient = new CloudFrontClient({ region: REGION });
    await invalidateCloudFront(cfClient, distributionId);

    logger.success(`\n✅ CloudFront invalidated for ${app.name}!\n`);
  } catch (error) {
    if (error instanceof Error && error.message?.includes("does not exist")) {
      logger.error(`Stack ${stackName} does not exist. Deploy the app first.`);
    } else {
      throw error;
    }
  }
}

async function showStatus(): Promise<void> {
  logger.info("\n📊 Deployment Status\n");

  const cfnClient = new CloudFormationClient({ region: REGION });
  const cfnUsEast1 = new CloudFormationClient({ region: "us-east-1" });

  // Check shared certificate
  const certArn = await getSharedCertificateArn();
  logger.info(`Shared Certificate: ${certArn ? "✅ Available" : "❌ Not found"}`);

  // Check each app
  for (const [key, app] of Object.entries(APPS)) {
    let stackName: string;
    let client = cfnClient;

    if (app.type === "shared") {
      stackName = `super-simple-apps-cognito-${STAGE}`;
    } else if (app.type === "static") {
      stackName = `${app.appName}-${STAGE}`;
    } else {
      stackName = `simple-flashcards-frontend-${STAGE}`;
    }

    try {
      const response = await client.send(
        new DescribeStacksCommand({ StackName: stackName })
      );
      const status = response.Stacks?.[0]?.StackStatus;
      const url = response.Stacks?.[0]?.Outputs?.find((o) => o.OutputKey === "WebsiteUrl")?.OutputValue;

      const statusIcon = status?.includes("COMPLETE") && !status?.includes("ROLLBACK") ? "✅" : "⚠️";
      logger.info(`${app.name}: ${statusIcon} ${status}${url ? ` - ${url}` : ""}`);
    } catch {
      logger.info(`${app.name}: ❌ Not deployed`);
    }
  }

  logger.info("");
}

async function showInteractiveMenu(): Promise<void> {
  console.clear();
  logger.info("═".repeat(60));
  logger.info("   Super Simple Apps - Deployment Manager");
  logger.info("═".repeat(60));
  logger.info(`   Stage: ${STAGE}    Region: ${REGION}`);
  logger.info("─".repeat(60));
  logger.info("");

  const menuItems: MenuItem[] = [
    { key: "1", label: "Deploy ALL apps", action: deployAll },
    { key: "2", label: "Deploy Shared Infrastructure", action: deployShared },
    { key: "3", label: "Deploy Flashcards", action: deployFlashcards },
    { key: "4", label: "Deploy CRM", action: deployCRM },
    { key: "5", label: "Deploy Invoice", action: deployInvoice },
    { key: "6", label: "Deploy Landing Page", action: () => deployStaticAppByKey("landing") },
    { key: "7", label: "Deploy Image Crop", action: () => deployStaticAppByKey("image-crop") },
    { key: "8", label: "Deploy Image Resize", action: () => deployStaticAppByKey("image-resize") },
    { key: "9", label: "Deploy Image Annotate", action: () => deployStaticAppByKey("image-annotate") },
    { key: "0", label: "Deploy Job Timer", action: () => deployStaticAppByKey("job-timer") },
    { key: "─", label: "─".repeat(40), action: async () => {} },
    { key: "b", label: "Build & Upload Frontend Only", action: showBuildMenu },
    { key: "i", label: "Invalidate CloudFront Only", action: showInvalidateMenu },
    { key: "r", label: "Remove Stacks", action: showRemoveMenu },
    { key: "s", label: "Show Status", action: showStatus },
    { key: "─", label: "─".repeat(40), action: async () => {} },
    { key: "q", label: "Quit", action: async () => process.exit(0) },
  ];

  for (const item of menuItems) {
    if (item.key === "─") {
      logger.info(`   ${item.label}`);
    } else {
      logger.info(`   [${item.key}] ${item.label}`);
    }
  }

  logger.info("");
  const choice = await prompt("   Enter choice: ");

  const selectedItem = menuItems.find((item) => item.key === choice);
  if (selectedItem && selectedItem.key !== "─") {
    try {
      await selectedItem.action();
    } catch (error) {
      logger.error(`Error: ${error instanceof Error ? error.message : error}`);
    }

    if (choice !== "q") {
      await prompt("\n   Press Enter to continue...");
      await showInteractiveMenu();
    }
  } else {
    logger.warning("Invalid choice");
    await showInteractiveMenu();
  }
}

async function showBuildMenu(): Promise<void> {
  logger.info("\n   Build & Upload Frontend\n");

  const apps = Object.entries(APPS).filter(([_, app]) => app.type !== "shared");

  for (let i = 0; i < apps.length; i++) {
    const [key, app] = apps[i];
    logger.info(`   [${i + 1}] ${app.name}`);
  }
  logger.info(`   [a] All apps`);
  logger.info(`   [b] Back`);

  const choice = await prompt("\n   Enter choice: ");

  if (choice === "b") return;

  if (choice === "a") {
    for (const [key] of apps) {
      await buildAndUploadOnly(key as AppKey);
    }
    return;
  }

  const index = parseInt(choice) - 1;
  if (index >= 0 && index < apps.length) {
    await buildAndUploadOnly(apps[index][0] as AppKey);
  }
}

async function showInvalidateMenu(): Promise<void> {
  logger.info("\n   Invalidate CloudFront\n");

  const apps = Object.entries(APPS).filter(([_, app]) => app.type !== "shared");

  for (let i = 0; i < apps.length; i++) {
    const [key, app] = apps[i];
    logger.info(`   [${i + 1}] ${app.name}`);
  }
  logger.info(`   [a] All apps`);
  logger.info(`   [b] Back`);

  const choice = await prompt("\n   Enter choice: ");

  if (choice === "b") return;

  if (choice === "a") {
    for (const [key] of apps) {
      await invalidateOnly(key as AppKey);
    }
    return;
  }

  const index = parseInt(choice) - 1;
  if (index >= 0 && index < apps.length) {
    await invalidateOnly(apps[index][0] as AppKey);
  }
}

async function showRemoveMenu(): Promise<void> {
  logger.info("\n   Remove Stacks\n");
  logger.warning("   ⚠️  This will delete CloudFormation stacks!\n");

  const apps = Object.entries(APPS).filter(([_, app]) => app.type === "static");

  for (let i = 0; i < apps.length; i++) {
    const [key, app] = apps[i];
    logger.info(`   [${i + 1}] ${app.name}`);
  }
  logger.info(`   [b] Back`);

  const choice = await prompt("\n   Enter choice: ");

  if (choice === "b") return;

  const index = parseInt(choice) - 1;
  if (index >= 0 && index < apps.length) {
    const confirm = await prompt(`\n   Type 'yes' to confirm deletion of ${apps[index][1].name}: `);
    if (confirm === "yes") {
      await removeApp(apps[index][0] as AppKey);
    } else {
      logger.info("   Cancelled");
    }
  }
}

async function main(): Promise<void> {
  // Handle command line options
  if (options.all) {
    await deployAll();
    return;
  }

  if (options.shared) {
    await deployShared();
    return;
  }

  if (options.app) {
    const appKey = options.app as AppKey;
    if (!APPS[appKey]) {
      logger.error(`Unknown app: ${options.app}`);
      logger.info(`Available apps: ${Object.keys(APPS).join(", ")}`);
      process.exit(1);
    }

    if (appKey === "shared") {
      await deployShared();
    } else if (appKey === "flashcards") {
      await deployFlashcards();
    } else if (appKey === "crm") {
      await deployCRM();
    } else if (appKey === "invoice") {
      await deployInvoice();
    } else {
      await deployStaticAppByKey(appKey);
    }
    return;
  }

  if (options.buildOnly) {
    const appKey = options.buildOnly as AppKey;
    if (!APPS[appKey]) {
      logger.error(`Unknown app: ${options.buildOnly}`);
      process.exit(1);
    }
    await buildAndUploadOnly(appKey);
    return;
  }

  if (options.invalidate) {
    const appKey = options.invalidate as AppKey;
    if (!APPS[appKey]) {
      logger.error(`Unknown app: ${options.invalidate}`);
      process.exit(1);
    }
    await invalidateOnly(appKey);
    return;
  }

  // Show interactive menu
  await showInteractiveMenu();
}

main().catch((error) => {
  logger.error(`Deployment failed: ${error.message || error}`);
  process.exit(1);
});
