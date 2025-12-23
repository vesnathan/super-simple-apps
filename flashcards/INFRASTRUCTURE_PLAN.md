# Super Simple Apps - Multi-App Infrastructure Plan

## Overview

Restructure the Simple Flashcards project to support multiple apps under `super-simple-apps.com`:
- `flashcards.super-simple-apps.com` (this project)
- `invoices.super-simple-apps.com` (future)
- More to come...

## Architecture Options

### Option A: Shared Certificate, Independent CloudFront (Recommended)

```
super-simple-apps.com (Route53 Hosted Zone)
├── *.super-simple-apps.com (ACM Wildcard Certificate - us-east-1)
├── flashcards.super-simple-apps.com → CloudFront (flashcards)
├── invoices.super-simple-apps.com → CloudFront (invoices)
└── api.super-simple-apps.com → AppSync/API Gateway (optional shared API)
```

**Pros:**
- Single wildcard certificate covers all subdomains
- Each app is fully independent
- Can deploy apps separately without affecting others
- Easy to add new apps

**Cons:**
- Need to manage certificate separately (but it's set once)

### Option B: Fully Shared Infrastructure

All apps share Cognito, DynamoDB (multi-tenant), etc.

**Pros:**
- Single sign-on across apps
- Less infrastructure

**Cons:**
- Tight coupling
- Complex permissions
- One failure affects all apps

## Recommended Approach (Option A)

### Phase 1: Shared DNS Infrastructure

Create a separate "super-simple-apps-dns" stack that manages:
1. Route53 Hosted Zone for `super-simple-apps.com`
2. Wildcard ACM certificate `*.super-simple-apps.com`

This stack is deployed **once** and outputs:
- `HostedZoneId`
- `WildcardCertificateArn`

### Phase 2: Per-App Infrastructure

Each app (flashcards, invoices, etc.) deploys its own:
- Cognito User Pool
- DynamoDB Table
- AppSync API
- Lambda Functions
- CloudFront + S3
- Route53 subdomain record (A record pointing to its CloudFront)

Apps import the shared certificate ARN but are otherwise independent.

## Project Structure Changes

### Current Structure:
```
simple-flashcards/
├── frontend/
├── backend/
├── deploy/
│   └── resources/
│       ├── Cognito/
│       ├── DynamoDB/
│       ├── AppSync/
│       ├── CloudFront/
│       ├── DNS/
│       └── Lambda/
└── ...
```

### Proposed Structure:
```
super-simple-apps/                    # Parent repo (optional)
├── shared-dns/                       # Shared DNS infrastructure
│   ├── deploy.ts
│   └── resources/
│       └── dns-zone.yaml            # Route53 + Wildcard Cert
│
├── flashcards/                       # This project (renamed)
│   ├── frontend/
│   ├── backend/
│   ├── deploy/
│   │   ├── deploy.ts
│   │   └── resources/
│   │       ├── Cognito/
│   │       ├── DynamoDB/
│   │       ├── AppSync/
│   │       ├── CloudFront/
│   │       ├── subdomain.yaml       # Just the A record
│   │       └── Lambda/
│   └── ...
│
└── invoices/                         # Future app
    ├── frontend/
    ├── backend/
    └── deploy/
```

## CloudFormation Template Changes

### 1. New Shared DNS Stack (shared-dns/resources/dns-zone.yaml)

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "Shared DNS for Super Simple Apps"

Parameters:
  DomainName:
    Type: String
    Default: "super-simple-apps.com"

Resources:
  # If you want CloudFormation to manage the hosted zone
  # HostedZone:
  #   Type: AWS::Route53::HostedZone
  #   Properties:
  #     Name: !Ref DomainName

  WildcardCertificate:
    Type: AWS::CertificateManager::Certificate
    Properties:
      DomainName: !Ref DomainName
      SubjectAlternativeNames:
        - !Sub "*.${DomainName}"
      ValidationMethod: DNS
      DomainValidationOptions:
        - DomainName: !Ref DomainName
          HostedZoneId: !Ref HostedZoneId  # Pass in existing zone

Outputs:
  WildcardCertificateArn:
    Value: !Ref WildcardCertificate
    Export:
      Name: SuperSimpleApps-WildcardCertificateArn
```

### 2. Updated CloudFront Template (flashcards/deploy/resources/CloudFront/frontend.yaml)

```yaml
Parameters:
  # ... existing params
  SubdomainName:
    Type: String
    Default: "flashcards"
  RootDomainName:
    Type: String
    Default: "super-simple-apps.com"
  CertificateArn:
    Type: String
    Description: "ARN of the wildcard certificate"

Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Aliases:
          - !Sub "${SubdomainName}.${RootDomainName}"
        ViewerCertificate:
          AcmCertificateArn: !Ref CertificateArn
          SslSupportMethod: sni-only
          MinimumProtocolVersion: TLSv1.2_2021
        # ... rest of config
```

### 3. New Subdomain Record (flashcards/deploy/resources/DNS/subdomain.yaml)

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "Subdomain record for Flashcards app"

Parameters:
  Stage:
    Type: String
  SubdomainName:
    Type: String
    Default: "flashcards"
  RootDomainName:
    Type: String
    Default: "super-simple-apps.com"
  HostedZoneId:
    Type: String
  CloudFrontDomainName:
    Type: String

Conditions:
  IsProd: !Equals [!Ref Stage, "prod"]

Resources:
  SubdomainRecord:
    Type: AWS::Route53::RecordSet
    Condition: IsProd
    Properties:
      HostedZoneId: !Ref HostedZoneId
      Name: !Sub "${SubdomainName}.${RootDomainName}"
      Type: A
      AliasTarget:
        HostedZoneId: Z2FDTNDATAQYW2  # CloudFront's fixed zone ID
        DNSName: !Ref CloudFrontDomainName
        EvaluateTargetHealth: false

Outputs:
  SubdomainUrl:
    Value: !If
      - IsProd
      - !Sub "https://${SubdomainName}.${RootDomainName}"
      - !Sub "https://${CloudFrontDomainName}"
```

## Resource Naming Convention Update

### Current:
```
simple-flashcards-{resource}-{stage}
```

### Proposed:
```
ssa-flashcards-{resource}-{stage}  # "ssa" = Super Simple Apps
ssa-invoices-{resource}-{stage}
```

Or keep app-specific prefixes:
```
flashcards-{resource}-{stage}
invoices-{resource}-{stage}
```

## Migration Steps

### Step 1: Create Shared DNS Infrastructure
1. Create `super-simple-apps.com` hosted zone in Route53 (if not already)
2. Update domain registrar NS records
3. Deploy shared DNS stack with wildcard certificate
4. Wait for certificate validation

### Step 2: Update Flashcards Deploy Script
1. Update `deploy.ts` to accept new parameters:
   - `--subdomain` (default: "flashcards")
   - `--root-domain` (default: "super-simple-apps.com")
   - `--certificate-arn` (from shared DNS stack)
2. Update CloudFront template to use subdomain
3. Replace full DNS stack with subdomain-only stack

### Step 3: Update Resource Names (Optional)
1. Rename stacks from `simple-flashcards-*` to `ssa-flashcards-*` or `flashcards-*`
2. Update all references in code

### Step 4: Test Deployment
1. Deploy to dev (uses CloudFront domain only)
2. Deploy to prod with custom subdomain

## Environment Variables Update

```bash
# Shared (in parent directory or CI/CD)
SSA_ROOT_DOMAIN=super-simple-apps.com
SSA_HOSTED_ZONE_ID=Z1234567890ABC
SSA_WILDCARD_CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/...

# Per-app
APP_SUBDOMAIN=flashcards  # or "invoices", etc.
STAGE=dev
```

## Next Steps

1. [ ] Confirm domain `super-simple-apps.com` is registered and accessible
2. [ ] Create Route53 hosted zone (if not already)
3. [ ] Create shared DNS stack with wildcard certificate
4. [ ] Update flashcards deploy script
5. [ ] Test deployment to `flashcards.super-simple-apps.com`
6. [ ] Document the pattern for future apps (invoices, etc.)
