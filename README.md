# Super Simple Apps

A collection of simple, useful web applications hosted on `super-simple-apps.com`.

## Architecture

```
super-simple-apps/
├── shared-infra/          # Shared AWS infrastructure
│   ├── resources/
│   │   ├── dns-certificate.yaml   # Wildcard SSL cert (*.super-simple-apps.com)
│   │   └── cognito.yaml           # Shared Cognito User Pool
│   └── deploy.ts                  # Deploy shared infrastructure
│
├── flashcards/            # Flashcards app → flashcards.super-simple-apps.com
│   ├── frontend/          # Next.js frontend
│   ├── backend/           # AppSync resolvers
│   └── deploy/            # CloudFormation templates
│
└── [future apps...]       # invoices/, notes/, etc.
```

## Domain Structure

- `super-simple-apps.com` - Main landing page (future)
- `flashcards.super-simple-apps.com` - Flashcards app
- `authentication.super-simple-apps.com` - Cognito hosted UI (prod)
- `*.super-simple-apps.com` - Covered by wildcard certificate

## Deployment Order

### 1. Deploy Shared Infrastructure (once)

```bash
cd shared-infra

# Set your Route53 Hosted Zone ID
export HOSTED_ZONE_ID=your-zone-id

# Deploy (creates certificate and Cognito)
yarn deploy:prod
```

This creates:
- Wildcard SSL certificate in us-east-1 (for CloudFront)
- Shared Cognito User Pool with custom domain

### 2. Deploy Individual Apps

```bash
# Flashcards
cd flashcards
yarn deploy:dev   # Development (no custom domain)
yarn deploy:prod  # Production → flashcards.super-simple-apps.com
```

## Environment Variables

Create a `.env` file in the root:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=ap-southeast-2

# Route53 (required for prod)
HOSTED_ZONE_ID=your-zone-id
```

## Adding a New App

1. Create new directory: `mkdir invoices`
2. Copy structure from flashcards
3. Update CloudFormation to use shared certificate
4. Add deploy scripts
5. Deploy: creates `invoices.super-simple-apps.com`

## Shared Resources

All apps share:
- **Wildcard SSL Certificate**: One cert covers all subdomains
- **Cognito User Pool**: Single sign-on across all apps
- **Route53 Hosted Zone**: One zone for all DNS records

Each app has its own:
- CloudFront distribution
- S3 bucket
- DynamoDB table(s)
- AppSync API
