/* eslint-disable no-console */
import {
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DeleteRestApiCommand,
  GetRestApisCommand,
} from "@aws-sdk/client-api-gateway";
import {
  DeleteFunctionCommand,
  ListFunctionsCommand,
} from "@aws-sdk/client-lambda";
import {
  DeleteLogGroupCommand,
  DescribeLogGroupsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import {
  CognitoIdentityProviderClient,
  DeleteUserPoolCommand,
  ListUserPoolsCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  IAMClient,
  DeleteRolePolicyCommand,
  DeleteRoleCommand,
  ListRolePoliciesCommand,
  ListRolesCommand,
} from "@aws-sdk/client-iam";

import { dynamoDB, apiGateway, lambda, CONFIG } from "../config/aws";

const cloudWatchLogs = new CloudWatchLogsClient({});
const cognito = new CognitoIdentityProviderClient({});
const iam = new IAMClient({});

async function cleanupDynamoDB() {
  console.log("Cleaning up DynamoDB tables...");
  try {
    const tables = await dynamoDB.send(new ListTablesCommand({}));
    const tablePrefix = `${CONFIG.APP_NAME}-${CONFIG.STAGE}`;

    if (tables.TableNames) {
      for (const tableName of tables.TableNames) {
        if (tableName.startsWith(tablePrefix)) {
          await dynamoDB.send(new DeleteTableCommand({ TableName: tableName }));
          console.log(`✓ Deleted table: ${tableName}`);
        }
      }
    }
  } catch (error: unknown) {
    console.error("✗ Error cleaning up DynamoDB:", error);
  }
}

async function cleanupAPIGateway() {
  console.log("Cleaning up API Gateway...");
  try {
    const apis = await apiGateway.send(new GetRestApisCommand({}));
    const apiName = `${CONFIG.APP_NAME}-${CONFIG.STAGE}`;
    const api = apis.items?.find((api) => api.name === apiName);

    if (api?.id) {
      await apiGateway.send(new DeleteRestApiCommand({ restApiId: api.id }));
      console.log(`✓ Deleted API Gateway: ${apiName}`);
    } else {
      console.log(`API Gateway ${apiName} not found`);
    }
  } catch (error) {
    console.error("✗ Error cleaning up API Gateway:", error);
  }
}

async function cleanupLambda() {
  console.log("Cleaning up Lambda functions...");
  try {
    const functions = await lambda.send(new ListFunctionsCommand({}));
    const functionPrefix = `${CONFIG.APP_NAME}-${CONFIG.STAGE}`;

    for (const fn of functions.Functions || []) {
      if (fn.FunctionName?.startsWith(functionPrefix)) {
        await lambda.send(
          new DeleteFunctionCommand({ FunctionName: fn.FunctionName }),
        );
        console.log(`✓ Deleted Lambda function: ${fn.FunctionName}`);
      }
    }
  } catch (error) {
    console.error("✗ Error cleaning up Lambda functions:", error);
  }
}

async function cleanupCloudWatchLogs() {
  console.log("Cleaning up CloudWatch Logs...");
  try {
    const prefix = `/aws/lambda/${CONFIG.APP_NAME}-${CONFIG.STAGE}`;
    const logGroups = await cloudWatchLogs.send(
      new DescribeLogGroupsCommand({ logGroupNamePrefix: prefix }),
    );

    await Promise.all(
      (logGroups.logGroups || []).map(async (group) => {
        if (group.logGroupName) {
          await cloudWatchLogs.send(
            new DeleteLogGroupCommand({ logGroupName: group.logGroupName }),
          );
          console.log(`✓ Deleted log group: ${group.logGroupName}`);
        }
      }),
    );
  } catch (error) {
    console.error("✗ Error cleaning up CloudWatch Logs:", error);
  }
}

async function cleanupCognito() {
  console.log("Cleaning up Cognito User Pools...");
  try {
    const userPools = await cognito.send(
      new ListUserPoolsCommand({ MaxResults: 60 }),
    );
    const poolPrefix = `${CONFIG.APP_NAME}-${CONFIG.STAGE}`;

    for (const pool of userPools.UserPools || []) {
      if (pool.Name?.startsWith(poolPrefix) && pool.Id) {
        await cognito.send(new DeleteUserPoolCommand({ UserPoolId: pool.Id }));
        console.log(`✓ Deleted User Pool: ${pool.Name}`);
      }
    }
  } catch (error) {
    console.error("✗ Error cleaning up Cognito User Pools:", error);
  }
}

async function cleanupIAM() {
  console.log("Cleaning up IAM resources...");
  try {
    const roles = await iam.send(new ListRolesCommand({}));
    const rolePrefix = `${CONFIG.APP_NAME}-${CONFIG.STAGE}`;

    for (const role of roles.Roles || []) {
      if (role.RoleName?.startsWith(rolePrefix)) {
        // Delete attached policies first
        const policies = await iam.send(
          new ListRolePoliciesCommand({ RoleName: role.RoleName }),
        );

        for (const policyName of policies.PolicyNames || []) {
          await iam.send(
            new DeleteRolePolicyCommand({
              RoleName: role.RoleName,
              PolicyName: policyName,
            }),
          );
          console.log(
            `✓ Deleted policy ${policyName} from role ${role.RoleName}`,
          );
        }

        // Then delete the role
        await iam.send(new DeleteRoleCommand({ RoleName: role.RoleName }));
        console.log(`✓ Deleted IAM role: ${role.RoleName}`);
      }
    }
  } catch (error) {
    console.error("✗ Error cleaning up IAM resources:", error);
  }
}

export async function cleanup() {
  console.log(`\nCleaning up resources for stage: ${CONFIG.STAGE}`);

  // Delete in reverse order of creation to handle dependencies
  await cleanupAPIGateway(); // First API Gateway (depends on Lambda)
  await cleanupLambda(); // Then Lambda functions
  await cleanupDynamoDB(); // Then DynamoDB tables
  await cleanupCloudWatchLogs(); // Then CloudWatch logs
  await cleanupCognito(); // Then Cognito resources
  await cleanupIAM(); // Finally IAM resources (these should be last as other services may depend on them)

  console.log("\n✨ Cleanup completed\n");
}

// Run if called directly
if (require.main === module) {
  cleanup().catch(console.error);
}
