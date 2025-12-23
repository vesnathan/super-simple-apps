import {
  IAMClient,
  GetRoleCommand,
  CreateRoleCommand,
  PutRolePolicyCommand,
  GetUserCommand,
} from "@aws-sdk/client-iam";
import { logger } from "./logger";

const ACCOUNT_ID = "430118819356";
const DEPLOYMENT_USER = "codespaces-deployment";

interface AWSError {
  name?: string;
  message?: string;
}

export class IamManager {
  private iam: IAMClient;
  private region: string;

  constructor(region: string = process.env.AWS_REGION || "ap-southeast-2") {
    this.region = region;
    this.iam = new IAMClient({ region });
  }

  async setupRole(stage: string, templateBucketName: string): Promise<string> {
    const roleName = `simple-flashcards-cfn-role-${stage}`;

    try {
      // Check if role exists
      logger.debug(`Checking if role ${roleName} exists...`);
      let roleArn: string | undefined;
      let roleExists = false;

      try {
        const response = await this.iam.send(new GetRoleCommand({ RoleName: roleName }));
        logger.debug(`Role ${roleName} already exists`);
        roleArn = response.Role?.Arn;
        roleExists = true;
      } catch (roleError: unknown) {
        const err = roleError as AWSError;
        if (!err.name?.includes("NoSuchEntity") && !err.message?.includes("cannot be found")) {
          throw roleError;
        }
        logger.debug(`Role ${roleName} does not exist, creating...`);
      }

      if (!roleExists) {
        // Create role with assume role policy
        logger.info(`Creating CloudFormation service role: ${roleName}`);
        const createRoleResponse = await this.iam.send(
          new CreateRoleCommand({
            RoleName: roleName,
            AssumeRolePolicyDocument: JSON.stringify({
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Principal: {
                    Service: "cloudformation.amazonaws.com",
                  },
                  Action: "sts:AssumeRole",
                },
                {
                  Effect: "Allow",
                  Principal: {
                    AWS: `arn:aws:iam::${ACCOUNT_ID}:user/${DEPLOYMENT_USER}`,
                  },
                  Action: "sts:AssumeRole",
                },
              ],
            }),
            Tags: [
              { Key: "Purpose", Value: "CloudFormation Stack Management" },
              { Key: "Project", Value: "simple-flashcards" },
            ],
          })
        );

        roleArn = createRoleResponse.Role?.Arn;
      }

      // Attach/update policy with all required permissions
      logger.info(`${roleExists ? "Updating" : "Attaching"} policy to role ${roleName}...`);
      const policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "CloudFormationPermissions",
            Effect: "Allow",
            Action: ["cloudformation:*"],
            Resource: "*",
          },
          {
            Sid: "S3Permissions",
            Effect: "Allow",
            Action: [
              "s3:CreateBucket",
              "s3:DeleteBucket",
              "s3:PutBucketPolicy",
              "s3:GetBucketPolicy",
              "s3:DeleteBucketPolicy",
              "s3:PutBucketCORS",
              "s3:GetBucketCORS",
              "s3:PutBucketPublicAccessBlock",
              "s3:GetBucketPublicAccessBlock",
              "s3:PutBucketOwnershipControls",
              "s3:GetBucketOwnershipControls",
              "s3:PutBucketTagging",
              "s3:GetBucketTagging",
              "s3:PutBucketVersioning",
              "s3:GetBucketVersioning",
              "s3:PutLifecycleConfiguration",
              "s3:GetLifecycleConfiguration",
              "s3:ListBucket",
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject",
              "s3:PutBucketWebsite",
              "s3:GetBucketWebsite",
              "s3:DeleteBucketWebsite",
            ],
            Resource: "*",
          },
          {
            Sid: "CloudFrontPermissions",
            Effect: "Allow",
            Action: [
              "cloudfront:CreateDistribution",
              "cloudfront:GetDistribution",
              "cloudfront:UpdateDistribution",
              "cloudfront:DeleteDistribution",
              "cloudfront:TagResource",
              "cloudfront:UntagResource",
              "cloudfront:ListTagsForResource",
              "cloudfront:CreateFunction",
              "cloudfront:GetFunction",
              "cloudfront:DescribeFunction",
              "cloudfront:UpdateFunction",
              "cloudfront:DeleteFunction",
              "cloudfront:PublishFunction",
              "cloudfront:CreateInvalidation",
              "cloudfront:GetInvalidation",
              "cloudfront:CreateOriginAccessControl",
              "cloudfront:GetOriginAccessControl",
              "cloudfront:UpdateOriginAccessControl",
              "cloudfront:DeleteOriginAccessControl",
            ],
            Resource: "*",
          },
          {
            Sid: "IAMPermissions",
            Effect: "Allow",
            Action: [
              "iam:CreateRole",
              "iam:GetRole",
              "iam:DeleteRole",
              "iam:PutRolePolicy",
              "iam:GetRolePolicy",
              "iam:DeleteRolePolicy",
              "iam:AttachRolePolicy",
              "iam:DetachRolePolicy",
              "iam:ListRolePolicies",
              "iam:ListAttachedRolePolicies",
              "iam:PassRole",
              "iam:UpdateAssumeRolePolicy",
              "iam:TagRole",
              "iam:UntagRole",
            ],
            Resource: "*",
          },
          {
            Sid: "DynamoDBPermissions",
            Effect: "Allow",
            Action: [
              "dynamodb:CreateTable",
              "dynamodb:DescribeTable",
              "dynamodb:DeleteTable",
              "dynamodb:UpdateTable",
              "dynamodb:TagResource",
              "dynamodb:UntagResource",
              "dynamodb:ListTagsOfResource",
              "dynamodb:DescribeContinuousBackups",
              "dynamodb:UpdateContinuousBackups",
              "dynamodb:DescribeTimeToLive",
              "dynamodb:UpdateTimeToLive",
              "dynamodb:DescribeStream",
              "dynamodb:GetRecords",
              "dynamodb:GetShardIterator",
              "dynamodb:ListStreams",
            ],
            Resource: "*",
          },
          {
            Sid: "LambdaPermissions",
            Effect: "Allow",
            Action: [
              "lambda:CreateFunction",
              "lambda:GetFunction",
              "lambda:DeleteFunction",
              "lambda:UpdateFunctionCode",
              "lambda:UpdateFunctionConfiguration",
              "lambda:AddPermission",
              "lambda:RemovePermission",
              "lambda:TagResource",
              "lambda:UntagResource",
              "lambda:ListTags",
              "lambda:CreateEventSourceMapping",
              "lambda:GetEventSourceMapping",
              "lambda:UpdateEventSourceMapping",
              "lambda:DeleteEventSourceMapping",
              "lambda:ListEventSourceMappings",
            ],
            Resource: "*",
          },
          {
            Sid: "ApiGatewayV2Permissions",
            Effect: "Allow",
            Action: [
              "apigateway:*",
            ],
            Resource: "*",
          },
          {
            Sid: "CognitoPermissions",
            Effect: "Allow",
            Action: [
              "cognito-idp:CreateUserPool",
              "cognito-idp:DescribeUserPool",
              "cognito-idp:DeleteUserPool",
              "cognito-idp:UpdateUserPool",
              "cognito-idp:CreateUserPoolDomain",
              "cognito-idp:DescribeUserPoolDomain",
              "cognito-idp:DeleteUserPoolDomain",
              "cognito-idp:CreateUserPoolClient",
              "cognito-idp:DescribeUserPoolClient",
              "cognito-idp:DeleteUserPoolClient",
              "cognito-idp:UpdateUserPoolClient",
              "cognito-idp:SetUserPoolMfaConfig",
              "cognito-idp:GetUserPoolMfaConfig",
              "cognito-idp:TagResource",
              "cognito-idp:UntagResource",
              "cognito-idp:ListTagsForResource",
              "cognito-identity:CreateIdentityPool",
              "cognito-identity:DescribeIdentityPool",
              "cognito-identity:DeleteIdentityPool",
              "cognito-identity:UpdateIdentityPool",
              "cognito-identity:SetIdentityPoolRoles",
              "cognito-identity:GetIdentityPoolRoles",
              "cognito-identity:TagResource",
              "cognito-identity:UntagResource",
              "cognito-identity:ListTagsForResource",
            ],
            Resource: "*",
          },
          {
            Sid: "AppSyncPermissions",
            Effect: "Allow",
            Action: [
              "appsync:CreateGraphqlApi",
              "appsync:GetGraphqlApi",
              "appsync:DeleteGraphqlApi",
              "appsync:UpdateGraphqlApi",
              "appsync:StartSchemaCreation",
              "appsync:GetSchemaCreationStatus",
              "appsync:CreateDataSource",
              "appsync:GetDataSource",
              "appsync:DeleteDataSource",
              "appsync:UpdateDataSource",
              "appsync:CreateResolver",
              "appsync:GetResolver",
              "appsync:DeleteResolver",
              "appsync:UpdateResolver",
              "appsync:CreateFunction",
              "appsync:GetFunction",
              "appsync:DeleteFunction",
              "appsync:UpdateFunction",
              "appsync:TagResource",
              "appsync:UntagResource",
              "appsync:ListTagsForResource",
            ],
            Resource: "*",
          },
          {
            Sid: "CloudWatchLogsPermissions",
            Effect: "Allow",
            Action: [
              "logs:CreateLogGroup",
              "logs:DeleteLogGroup",
              "logs:DescribeLogGroups",
              "logs:PutRetentionPolicy",
              "logs:DeleteRetentionPolicy",
              "logs:TagLogGroup",
              "logs:UntagLogGroup",
              "logs:ListTagsLogGroup",
              "logs:ListTagsForResource",
              "logs:TagResource",
              "logs:UntagResource",
            ],
            Resource: "*",
          },
          {
            Sid: "STSPermissions",
            Effect: "Allow",
            Action: ["sts:AssumeRole"],
            Resource: "*",
          },
        ],
      };

      await this.iam.send(
        new PutRolePolicyCommand({
          RoleName: roleName,
          PolicyName: `${roleName}-policy`,
          PolicyDocument: JSON.stringify(policyDocument),
        })
      );

      // Add S3 bucket read policy for templates
      const s3PolicyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "s3:GetObject",
            Resource: `arn:aws:s3:::${templateBucketName}/*`,
          },
        ],
      };

      await this.iam.send(
        new PutRolePolicyCommand({
          RoleName: roleName,
          PolicyName: `${roleName}-s3-read-policy`,
          PolicyDocument: JSON.stringify(s3PolicyDocument),
        })
      );

      logger.success(`${roleExists ? "Updated" : "Created"} role ${roleName} with policy`);

      // Wait for IAM role and policies to propagate
      if (!roleExists) {
        logger.debug("Waiting 10 seconds for IAM role to propagate...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }

      if (!roleArn) {
        throw new Error(`Failed to get ARN for role ${roleName}`);
      }

      return roleArn;
    } catch (error: unknown) {
      const err = error as AWSError;
      logger.error(`Failed to setup role ${roleName}: ${err.message || String(error)}`);
      throw error;
    }
  }
}
