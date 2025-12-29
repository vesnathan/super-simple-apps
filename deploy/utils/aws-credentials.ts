import inquirer from "inquirer";
import { logger } from "./logger";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { AwsCredentialIdentity } from "@aws-sdk/types";

interface ErrorWithMessage {
  message?: string;
}

export async function getAwsCredentials(): Promise<
  AwsCredentialIdentity | undefined
> {
  await configureAwsCredentials();

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  return undefined;
}

export async function configureAwsCredentials(): Promise<void> {
  // Only ask for credentials if they're not already set or fail validation
  const validateExistingCredentials = async (): Promise<boolean> => {
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_ACCOUNT_ID
    ) {
      return false;
    }

    try {
      const {
        STSClient,
        GetCallerIdentityCommand,
      } = require("@aws-sdk/client-sts");
      const stsClient = new STSClient({ region: "ap-southeast-2" });
      await stsClient.send(new GetCallerIdentityCommand({}));
      logger.success("AWS credentials validated successfully");
      return true;
    } catch (error: unknown) {
      const err = error as ErrorWithMessage;
      logger.warning(
        `Existing credentials failed validation: ${err.message || String(error)}`,
      );
      return false;
    }
  };

  const isValid = await validateExistingCredentials();
  if (!isValid) {
    logger.info("Please enter your AWS credentials:");

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "accessKeyId",
        message: "AWS Access Key ID:",
        validate: (input: string) => {
          return input.length > 0 ? true : "Access Key ID cannot be empty";
        },
      },
      {
        type: "password",
        name: "secretAccessKey",
        message: "AWS Secret Access Key:",
        mask: "*",
        validate: (input: string) => {
          return input.length > 0 ? true : "Secret Access Key cannot be empty";
        },
      },
      {
        type: "input",
        name: "accountId",
        message: "AWS Account ID:",
        validate: (input: string) => {
          return /^\d{12}$/.test(input) ? true : "Account ID must be 12 digits";
        },
      },
    ]);

    // Set the credentials in environment variables
    process.env.AWS_ACCESS_KEY_ID = answers.accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = answers.secretAccessKey;
    process.env.AWS_ACCOUNT_ID = answers.accountId;

    // Save credentials to the root .env file
    try {
      const rootEnvPath = join(__dirname, "../../.env");
      let envContent = "";

      // Read existing .env if it exists
      if (existsSync(rootEnvPath)) {
        envContent = readFileSync(rootEnvPath, "utf-8");
        // Remove old AWS credentials lines
        envContent = envContent
          .split("\n")
          .filter(line => !line.startsWith("AWS_ACCESS_KEY_ID=") &&
                         !line.startsWith("AWS_SECRET_ACCESS_KEY=") &&
                         !line.startsWith("AWS_ACCOUNT_ID="))
          .join("\n");
        if (envContent && !envContent.endsWith("\n")) {
          envContent += "\n";
        }
      }

      envContent += `AWS_ACCESS_KEY_ID=${answers.accessKeyId}
AWS_SECRET_ACCESS_KEY=${answers.secretAccessKey}
AWS_ACCOUNT_ID=${answers.accountId}
`;
      writeFileSync(rootEnvPath, envContent);
      logger.success("AWS credentials saved to .env file");
    } catch (error) {
      logger.warning(
        "Could not save credentials to .env file. They will only persist for this session.",
      );
    }

    // Validate the new credentials
    try {
      const {
        STSClient,
        GetCallerIdentityCommand,
      } = require("@aws-sdk/client-sts");
      const stsClient = new STSClient({ region: "ap-southeast-2" });
      await stsClient.send(new GetCallerIdentityCommand({}));
      logger.success("AWS credentials configured and validated successfully");
    } catch (error: unknown) {
      const err = error as ErrorWithMessage;
      logger.error(`Failed to validate AWS credentials: ${err.message || String(error)}`);
      throw error;
    }
  }
}
