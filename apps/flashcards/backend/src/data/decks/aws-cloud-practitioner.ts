import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const awsCloudPractitioner: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000005",
  "AWS Cloud Practitioner",
  "Study for the AWS Certified Cloud Practitioner exam. Covers cloud computing concepts, AWS core services (EC2, S3, RDS, Lambda), security, pricing models, and the shared responsibility model.",
  ["it", "it-certifications", "aws", "cloud-computing", "certification"],
  [
  // Cloud Concepts
  mcCard(
    "What is cloud computing?",
    ["On-demand delivery of IT resources over the internet", "Running servers in your office", "Using external hard drives"],
    0,
    { explanation: "Cloud computing delivers compute, storage, and other resources on-demand via the internet.", researchUrl: "https://aws.amazon.com/what-is-cloud-computing/" }
  ),
  mcCard(
    "What are the benefits of cloud computing?",
    ["Elasticity, pay-as-you-go, global reach, speed", "Fixed costs, limited capacity", "Local storage only"],
    0,
    { explanation: "Cloud offers flexibility, cost efficiency, and global infrastructure.", researchUrl: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html" }
  ),
  mcCard(
    "What is the difference between CapEx and OpEx?",
    ["CapEx is upfront capital; OpEx is ongoing operational costs", "They are the same", "CapEx is operational; OpEx is capital"],
    0,
    { explanation: "Cloud shifts from CapEx (buying hardware) to OpEx (paying for usage).", researchUrl: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html" }
  ),
  textCard(
    "What are the three cloud deployment models?",
    "Public Cloud (AWS, Azure), Private Cloud (on-premises), Hybrid Cloud (combination of both).",
    { researchUrl: "https://aws.amazon.com/types-of-cloud-computing/" }
  ),
  mcCard(
    "What are the three cloud service models?",
    ["IaaS, PaaS, SaaS", "CPU, RAM, Storage", "Web, Mobile, Desktop"],
    0,
    { explanation: "Infrastructure as a Service, Platform as a Service, Software as a Service.", researchUrl: "https://aws.amazon.com/types-of-cloud-computing/" }
  ),

  // AWS Global Infrastructure
  mcCard(
    "What is an AWS Region?",
    ["A geographic area with multiple Availability Zones", "A single data center", "A virtual network"],
    0,
    { explanation: "Regions are separate geographic areas like us-east-1, eu-west-1.", researchUrl: "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/" }
  ),
  mcCard(
    "What is an Availability Zone (AZ)?",
    ["One or more data centers with redundant power/networking", "A country", "A virtual server"],
    0,
    { explanation: "AZs are isolated locations within a Region for fault tolerance.", researchUrl: "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/" }
  ),
  mcCard(
    "What are Edge Locations used for?",
    ["Content delivery (CloudFront) caching", "Running EC2 instances", "Storing databases"],
    0,
    { explanation: "Edge locations cache content closer to users for faster delivery.", researchUrl: "https://aws.amazon.com/cloudfront/features/" }
  ),
  textCard(
    "How many Availability Zones does a typical Region have?",
    "Usually 3 or more AZs per Region, providing fault tolerance.",
    { researchUrl: "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/" }
  ),

  // Shared Responsibility Model
  mcCard(
    "In the shared responsibility model, what is AWS responsible for?",
    ["Security OF the cloud (infrastructure)", "Security IN the cloud (data)", "Customer applications"],
    0,
    { explanation: "AWS manages physical infrastructure, networking, and hypervisor.", researchUrl: "https://aws.amazon.com/compliance/shared-responsibility-model/" }
  ),
  mcCard(
    "In the shared responsibility model, what is the customer responsible for?",
    ["Security IN the cloud (data, configs, access)", "Physical data centers", "Network hardware"],
    0,
    { explanation: "Customers manage their data, encryption, access control, and applications.", researchUrl: "https://aws.amazon.com/compliance/shared-responsibility-model/" }
  ),
  textCard(
    "Who is responsible for patching the guest OS on EC2?",
    "The customer. AWS manages the physical infrastructure and hypervisor, but customers manage their EC2 instances.",
    { researchUrl: "https://aws.amazon.com/compliance/shared-responsibility-model/" }
  ),
  textCard(
    "Who is responsible for patching RDS database engines?",
    "AWS handles RDS engine patching. This is a managed service.",
    { researchUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html" }
  ),

  // Compute Services
  mcCard(
    "What is Amazon EC2?",
    ["Virtual servers in the cloud", "Object storage", "Database service"],
    0,
    { explanation: "Elastic Compute Cloud provides resizable virtual servers.", researchUrl: "https://aws.amazon.com/ec2/" }
  ),
  mcCard(
    "What is AWS Lambda?",
    ["Serverless compute - run code without managing servers", "Virtual machines", "Container orchestration"],
    0,
    { explanation: "Lambda runs code in response to events; you pay only for compute time.", researchUrl: "https://aws.amazon.com/lambda/" }
  ),
  mcCard(
    "What is Amazon ECS?",
    ["Container orchestration service", "Virtual servers", "Serverless functions"],
    0,
    { explanation: "Elastic Container Service runs Docker containers on AWS.", researchUrl: "https://aws.amazon.com/ecs/" }
  ),
  mcCard(
    "What is AWS Fargate?",
    ["Serverless containers - no EC2 management", "Virtual machines", "Database service"],
    0,
    { explanation: "Fargate runs containers without managing the underlying infrastructure.", researchUrl: "https://aws.amazon.com/fargate/" }
  ),
  textCard(
    "What is Amazon Lightsail?",
    "Simple virtual private servers for small projects - easy to use with predictable pricing.",
    { researchUrl: "https://aws.amazon.com/lightsail/" }
  ),
  mcCard(
    "What is AWS Elastic Beanstalk?",
    ["PaaS for deploying applications easily", "Container service", "Database service"],
    0,
    { explanation: "Elastic Beanstalk automatically handles deployment, scaling, and monitoring.", researchUrl: "https://aws.amazon.com/elasticbeanstalk/" }
  ),

  // Storage Services
  mcCard(
    "What is Amazon S3?",
    ["Object storage service", "Block storage", "File storage"],
    0,
    { explanation: "Simple Storage Service stores objects (files) with high durability.", researchUrl: "https://aws.amazon.com/s3/" }
  ),
  mcCard(
    "What is the durability of S3 Standard?",
    ["99.999999999% (11 9s)", "99.9%", "99.99%"],
    0,
    { explanation: "S3 is designed for 11 9s of durability.", researchUrl: "https://aws.amazon.com/s3/storage-classes/" }
  ),
  mcCard(
    "What is Amazon EBS?",
    ["Block storage for EC2 instances", "Object storage", "File storage"],
    0,
    { explanation: "Elastic Block Store provides persistent block storage for EC2.", researchUrl: "https://aws.amazon.com/ebs/" }
  ),
  mcCard(
    "What is Amazon EFS?",
    ["Managed file storage (NFS) for multiple EC2 instances", "Object storage", "Block storage"],
    0,
    { explanation: "Elastic File System is shared file storage accessible from multiple instances.", researchUrl: "https://aws.amazon.com/efs/" }
  ),
  mcCard(
    "What is S3 Glacier?",
    ["Low-cost storage for archiving and backup", "Fast storage for active data", "Database storage"],
    0,
    { explanation: "Glacier is for long-term archival with retrieval times from minutes to hours.", researchUrl: "https://aws.amazon.com/s3/storage-classes/glacier/" }
  ),
  textCard(
    "What are S3 storage classes?",
    "Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier, Glacier Deep Archive - each with different cost/access tradeoffs.",
    { researchUrl: "https://aws.amazon.com/s3/storage-classes/" }
  ),

  // Database Services
  mcCard(
    "What is Amazon RDS?",
    ["Managed relational database service", "NoSQL database", "Data warehouse"],
    0,
    { explanation: "RDS manages MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Aurora.", researchUrl: "https://aws.amazon.com/rds/" }
  ),
  mcCard(
    "What is Amazon DynamoDB?",
    ["Managed NoSQL key-value database", "Relational database", "Data warehouse"],
    0,
    { explanation: "DynamoDB is a fully managed, serverless NoSQL database.", researchUrl: "https://aws.amazon.com/dynamodb/" }
  ),
  mcCard(
    "What is Amazon Aurora?",
    ["High-performance managed relational database", "NoSQL database", "Object storage"],
    0,
    { explanation: "Aurora is MySQL/PostgreSQL-compatible with up to 5x better performance.", researchUrl: "https://aws.amazon.com/rds/aurora/" }
  ),
  mcCard(
    "What is Amazon Redshift?",
    ["Data warehouse for analytics", "Transactional database", "Object storage"],
    0,
    { explanation: "Redshift is a petabyte-scale data warehouse for business intelligence.", researchUrl: "https://aws.amazon.com/redshift/" }
  ),
  textCard(
    "What is Amazon ElastiCache?",
    "Managed in-memory cache service supporting Redis and Memcached for faster application performance.",
    { researchUrl: "https://aws.amazon.com/elasticache/" }
  ),

  // Networking
  mcCard(
    "What is Amazon VPC?",
    ["Virtual Private Cloud - isolated network in AWS", "Virtual server", "Storage service"],
    0,
    { explanation: "VPC lets you create a logically isolated network within AWS.", researchUrl: "https://aws.amazon.com/vpc/" }
  ),
  mcCard(
    "What is a subnet in VPC?",
    ["A range of IP addresses within a VPC", "A firewall", "A load balancer"],
    0,
    { explanation: "Subnets divide your VPC into public and private sections.", researchUrl: "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html" }
  ),
  mcCard(
    "What is an Internet Gateway?",
    ["Allows VPC resources to access the internet", "Private network only", "Database connector"],
    0,
    { explanation: "IGW enables internet connectivity for public subnets.", researchUrl: "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html" }
  ),
  mcCard(
    "What is a NAT Gateway?",
    ["Allows private subnet resources to access internet (outbound only)", "Provides inbound internet access", "A firewall"],
    0,
    { explanation: "NAT Gateway lets private instances access the internet without being publicly accessible.", researchUrl: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html" }
  ),
  mcCard(
    "What is Amazon Route 53?",
    ["DNS and domain registration service", "Load balancer", "CDN"],
    0,
    { explanation: "Route 53 is AWS's DNS service for domain management and routing.", researchUrl: "https://aws.amazon.com/route53/" }
  ),
  mcCard(
    "What is Amazon CloudFront?",
    ["Content Delivery Network (CDN)", "DNS service", "Load balancer"],
    0,
    { explanation: "CloudFront caches content at edge locations for faster delivery.", researchUrl: "https://aws.amazon.com/cloudfront/" }
  ),
  mcCard(
    "What is Elastic Load Balancing?",
    ["Distributes traffic across multiple targets", "DNS service", "CDN"],
    0,
    { explanation: "ELB automatically distributes incoming traffic across instances.", researchUrl: "https://aws.amazon.com/elasticloadbalancing/" }
  ),

  // Security Services
  mcCard(
    "What is IAM?",
    ["Identity and Access Management", "Internet Access Manager", "Instance Application Monitor"],
    0,
    { explanation: "IAM controls who can access what AWS resources.", researchUrl: "https://aws.amazon.com/iam/" }
  ),
  textCard(
    "What are the IAM identity types?",
    "Users (people), Groups (collections of users), Roles (temporary permissions for services/applications).",
    { researchUrl: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html" }
  ),
  mcCard(
    "What is an IAM policy?",
    ["JSON document defining permissions", "User account", "Security group"],
    0,
    { explanation: "Policies define what actions are allowed or denied on what resources.", researchUrl: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html" }
  ),
  mcCard(
    "What is AWS KMS?",
    ["Key Management Service for encryption keys", "Instance monitoring", "Load balancing"],
    0,
    { explanation: "KMS creates and manages encryption keys for your data.", researchUrl: "https://aws.amazon.com/kms/" }
  ),
  mcCard(
    "What is AWS WAF?",
    ["Web Application Firewall", "Wide Area Firewall", "Wireless Access Firewall"],
    0,
    { explanation: "WAF protects web applications from common attacks like SQL injection.", researchUrl: "https://aws.amazon.com/waf/" }
  ),
  mcCard(
    "What is AWS Shield?",
    ["DDoS protection service", "Encryption service", "Firewall"],
    0,
    { explanation: "Shield provides protection against DDoS attacks.", researchUrl: "https://aws.amazon.com/shield/" }
  ),
  textCard(
    "What is the difference between Security Groups and NACLs?",
    "Security Groups are stateful and at instance level. NACLs are stateless and at subnet level.",
    { researchUrl: "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html" }
  ),

  // Management and Governance
  mcCard(
    "What is AWS CloudWatch?",
    ["Monitoring and observability service", "Deployment service", "Database service"],
    0,
    { explanation: "CloudWatch monitors resources, collects logs, and sets alarms.", researchUrl: "https://aws.amazon.com/cloudwatch/" }
  ),
  mcCard(
    "What is AWS CloudTrail?",
    ["Logs API calls and user activity", "Monitors performance", "Manages deployments"],
    0,
    { explanation: "CloudTrail records all API calls for auditing and compliance.", researchUrl: "https://aws.amazon.com/cloudtrail/" }
  ),
  mcCard(
    "What is AWS Config?",
    ["Tracks resource configuration changes", "Performance monitoring", "Log analysis"],
    0,
    { explanation: "Config records and evaluates resource configurations over time.", researchUrl: "https://aws.amazon.com/config/" }
  ),
  mcCard(
    "What is AWS Trusted Advisor?",
    ["Best practice recommendations", "Deployment service", "Database service"],
    0,
    { explanation: "Trusted Advisor checks for cost optimization, security, and performance.", researchUrl: "https://aws.amazon.com/premiumsupport/technology/trusted-advisor/" }
  ),
  textCard(
    "What are the Trusted Advisor categories?",
    "Cost Optimization, Performance, Security, Fault Tolerance, Service Limits.",
    { researchUrl: "https://aws.amazon.com/premiumsupport/technology/trusted-advisor/" }
  ),

  // Pricing and Support
  mcCard(
    "What is the AWS Free Tier?",
    ["Free usage of select services for 12 months + always free offers", "Everything is free", "Only EC2 is free"],
    0,
    { explanation: "Free Tier includes 12-month free, always free, and trial offers.", researchUrl: "https://aws.amazon.com/free/" }
  ),
  mcCard(
    "What EC2 pricing model has no long-term commitment?",
    ["On-Demand", "Reserved Instances", "Dedicated Hosts"],
    0,
    { explanation: "On-Demand instances have no upfront payment or commitment.", researchUrl: "https://aws.amazon.com/ec2/pricing/" }
  ),
  mcCard(
    "What EC2 pricing model offers the biggest discount for long-term use?",
    ["Reserved Instances (up to 72% off)", "On-Demand", "Spot Instances"],
    0,
    { explanation: "Reserved Instances offer significant discounts for 1-3 year commitments.", researchUrl: "https://aws.amazon.com/ec2/pricing/reserved-instances/" }
  ),
  mcCard(
    "What are Spot Instances?",
    ["Unused EC2 capacity at up to 90% discount", "Always-available instances", "Reserved capacity"],
    0,
    { explanation: "Spot Instances use spare capacity but can be interrupted.", researchUrl: "https://aws.amazon.com/ec2/spot/" }
  ),
  textCard(
    "What is AWS Organizations?",
    "Centrally manage multiple AWS accounts with consolidated billing and policy management.",
    { researchUrl: "https://aws.amazon.com/organizations/" }
  ),
  mcCard(
    "What are the AWS Support plans?",
    ["Basic, Developer, Business, Enterprise", "Free, Standard, Premium", "Bronze, Silver, Gold"],
    0,
    { explanation: "Support plans range from Basic (free) to Enterprise (premium support).", researchUrl: "https://aws.amazon.com/premiumsupport/plans/" }
  ),
  textCard(
    "What support is included in the Basic plan?",
    "Customer service, documentation, whitepapers, and support forums. No technical support.",
    { researchUrl: "https://aws.amazon.com/premiumsupport/plans/" }
  ),

  // Well-Architected Framework
  textCard(
    "What are the 6 pillars of the Well-Architected Framework?",
    "Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.",
    { researchUrl: "https://aws.amazon.com/architecture/well-architected/" }
  ),
  mcCard(
    "Which pillar focuses on protecting data and systems?",
    ["Security", "Reliability", "Performance Efficiency"],
    0,
    { explanation: "The Security pillar covers identity, data protection, and incident response.", researchUrl: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html" }
  ),
  mcCard(
    "Which pillar focuses on system recovery and availability?",
    ["Reliability", "Security", "Cost Optimization"],
    0,
    { explanation: "Reliability ensures workloads recover from failures and meet demand.", researchUrl: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html" }
  ),

  // Additional Services
  textCard(
    "What is Amazon SNS?",
    "Simple Notification Service - pub/sub messaging for sending notifications to subscribers.",
    { researchUrl: "https://aws.amazon.com/sns/" }
  ),
  textCard(
    "What is Amazon SQS?",
    "Simple Queue Service - fully managed message queuing for decoupling applications.",
    { researchUrl: "https://aws.amazon.com/sqs/" }
  ),
  mcCard(
    "What is AWS CloudFormation?",
    ["Infrastructure as Code - provision resources with templates", "Monitoring service", "Database service"],
    0,
    { explanation: "CloudFormation automates infrastructure deployment using templates.", researchUrl: "https://aws.amazon.com/cloudformation/" }
  ),
  textCard(
    "What is Amazon Cognito?",
    "User identity and access management for web and mobile apps - handles sign-up, sign-in, and access control.",
    { researchUrl: "https://aws.amazon.com/cognito/" }
  ),
  mcCard(
    "What is AWS Artifact?",
    ["Compliance and security documents", "Code repository", "Deployment service"],
    0,
    { explanation: "Artifact provides access to AWS security and compliance reports.", researchUrl: "https://aws.amazon.com/artifact/" }
  ),
]);
