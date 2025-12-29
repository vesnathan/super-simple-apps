import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { logger } from "@super-simple-apps/deploy";

export interface StackOutput {
  OutputKey: string;
  OutputValue: string;
  Description?: string;
}

export interface StageDeploymentOutputs {
  lastUpdated: string;
  outputs: Record<string, string>;
}

export interface DeploymentOutputs {
  stages: Record<string, StageDeploymentOutputs>;
}

export class OutputsManager {
  private outputsFilePath: string;
  private region: string;

  constructor(region: string = "ap-southeast-2") {
    this.outputsFilePath = join(__dirname, "deployment-outputs.json");
    this.region = region;
  }

  async saveStackOutputs(
    stackName: string,
    stage: string,
  ): Promise<Record<string, string>> {
    try {
      const cfClient = new CloudFormationClient({ region: this.region });

      logger.debug(`Fetching outputs for stack: ${stackName}`);

      const command = new DescribeStacksCommand({ StackName: stackName });
      const response = await cfClient.send(command);

      const stack = response.Stacks?.[0];
      if (!stack?.Outputs) {
        logger.warning(`No outputs found for stack ${stackName}`);
        return {};
      }

      // Convert to simple key-value map
      const outputsMap: Record<string, string> = {};
      for (const output of stack.Outputs) {
        if (output.OutputKey && output.OutputValue) {
          outputsMap[output.OutputKey] = output.OutputValue;
        }
      }

      // Load existing outputs
      const deploymentOutputs = await this.loadOutputs();

      // Initialize stage if it doesn't exist
      if (!deploymentOutputs.stages[stage]) {
        deploymentOutputs.stages[stage] = {
          lastUpdated: new Date().toISOString(),
          outputs: {},
        };
      }

      // Merge new outputs with existing
      deploymentOutputs.stages[stage].outputs = {
        ...deploymentOutputs.stages[stage].outputs,
        ...outputsMap,
      };
      deploymentOutputs.stages[stage].lastUpdated = new Date().toISOString();

      // Save updated outputs
      await this.saveOutputs(deploymentOutputs);

      logger.debug(`Saved ${Object.keys(outputsMap).length} outputs from ${stackName}`);
      return outputsMap;
    } catch (error: unknown) {
      logger.error(`Failed to save outputs for stack ${stackName}: ${(error as Error).message}`);
      throw error;
    }
  }

  async loadOutputs(): Promise<DeploymentOutputs> {
    if (!existsSync(this.outputsFilePath)) {
      return { stages: {} };
    }

    try {
      const content = await readFile(this.outputsFilePath, "utf8");
      return JSON.parse(content);
    } catch {
      return { stages: {} };
    }
  }

  async saveOutputs(outputs: DeploymentOutputs): Promise<void> {
    await mkdir(join(__dirname), { recursive: true });
    await writeFile(
      this.outputsFilePath,
      JSON.stringify(outputs, null, 2),
    );
  }

  async getOutputValue(stage: string, key: string): Promise<string | null> {
    const outputs = await this.loadOutputs();
    return outputs.stages[stage]?.outputs[key] || null;
  }

  async getAllOutputs(stage: string): Promise<Record<string, string>> {
    const outputs = await this.loadOutputs();
    return outputs.stages[stage]?.outputs || {};
  }

  getOutputValueSync(stage: string, key: string): string | undefined {
    try {
      if (!existsSync(this.outputsFilePath)) {
        return undefined;
      }
      const content = require("fs").readFileSync(this.outputsFilePath, "utf8");
      const outputs: DeploymentOutputs = JSON.parse(content);
      return outputs.stages[stage]?.outputs[key];
    } catch {
      return undefined;
    }
  }
}
