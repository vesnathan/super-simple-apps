# IAM Policy Setup for Super Simple Apps

## Overview

This directory contains IAM policies for secure CloudFormation-based deployments.

## Security Architecture

The deployment uses a **least-privilege** approach:

1. **codespaces-deployment user** - Minimal permissions to:
   - Create/update/delete CloudFormation stacks
   - Create/manage CloudFormation execution roles
   - Manage template S3 buckets
   - Assume app-specific deploy roles (created by CloudFormation)

2. **super-simple-apps-cfn-role-{stage}** - CloudFormation execution role with permissions to:
   - Create all AWS resources (S3, CloudFront, Cognito, DynamoDB, Lambda, etc.)
   - Created/updated by the deploy script automatically

3. **ssa-{app}-deploy-role-{stage}** - Per-app deploy roles (created by CloudFormation):
   - Scoped to only that app's S3 bucket and CloudFront distribution
   - Used for uploading frontend files and invalidating cache
   - Requires external ID matching `{app}-{stage}` for additional security

## Setup Instructions

### Step 1: Update codespaces-deployment user policy

In the AWS IAM Console:

1. Go to IAM > Users > codespaces-deployment
2. Remove any existing inline policies
3. Create a new inline policy with the contents of `codespaces-deployment-minimal.json`

### Step 2: Deploy shared infrastructure

```bash
yarn deploy:shared-infra:prod
```

This creates:
- DNS certificate in us-east-1
- Cognito user pool
- CloudFormation execution role

### Step 3: Deploy all apps

```bash
yarn deploy:all:prod
```

Each app stack will create its own scoped deploy role that the deploy script assumes to upload files.

## How It Works

1. **Stack deployment**: Uses codespaces-deployment credentials directly
2. **Frontend upload**:
   - Stack creates `ssa-{app}-deploy-role-{stage}`
   - Deploy script assumes that role with external ID
   - Uses assumed credentials for S3 upload and CloudFront invalidation
3. **Role cleanup**: Roles are deleted when stack is deleted

## Security Benefits

- No broad S3/CloudFront permissions on the deployment user
- Each app can only access its own resources
- External ID prevents confused deputy attacks
- All resources are tagged and auditable
- CloudFormation tracks all resource creation/deletion
