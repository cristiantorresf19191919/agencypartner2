"use client";

import React from "react";
import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import { useBlogPostContent } from "@/lib/blogTranslations";
import { getCategoryForPost } from "@/lib/blogCategories";
import styles from "../BlogPostPage.module.css";

export default function AWSCloudPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent('aws-cloud', language);
  const category = getCategoryForPost("aws-cloud");

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          {category && (
            <>
              <li className={styles.breadcrumbSeparator}>/</li>
              <li>
                <ButtonLink href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  {category.title}
                </ButtonLink>
              </li>
            </>
          )}
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>
            {postContent?.breadcrumbLabel || 'AWS Cloud'}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || 'AWS Cloud: Zero to Hero'}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle || 'Complete AWS guide from fundamentals to advanced architecture. Learn core services, security best practices, infrastructure as code, serverless patterns, cost optimization, and production-ready architectures used by senior engineers.'}
        </Text>
      </div>

      {/* AWS Fundamentals */}
      <section id="aws-fundamentals" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. AWS Fundamentals & Core Concepts
              </Heading>
              <Text className={styles.sectionDescription}>
                Understand AWS regions, availability zones, accounts, IAM fundamentals, and the AWS shared responsibility model.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Concepts:</strong>
                <br />• <strong>Regions:</strong> Geographic locations (us-east-1, eu-west-1, etc.)
                <br />• <strong>Availability Zones:</strong> Isolated data centers within a region
                <br />• <strong>IAM:</strong> Identity and Access Management for security
                <br />• <strong>Shared Responsibility:</strong> AWS manages infrastructure, you manage your data and applications
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ AWS CLI Setup & Configuration
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity

# ✅ Environment Variables (Best Practice)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1

# ✅ AWS SDK for JavaScript/TypeScript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { EC2Client, RunInstancesCommand } from '@aws-sdk/client-ec2';

// Initialize clients
const s3Client = new S3Client({ region: 'us-east-1' });
const ec2Client = new EC2Client({ region: 'us-east-1' });

// ✅ AWS SDK with credentials from environment
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ✅ Using AWS SDK with IAM roles (EC2/Lambda)
// No credentials needed - uses instance/execution role
const s3Client = new S3Client({ region: 'us-east-1' });`}
              language="bash"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* EC2 & Compute */}
      <section id="ec2-compute" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. EC2 & Compute Services
              </Heading>
              <Text className={styles.sectionDescription}>
                Launch and manage EC2 instances, understand instance types, security groups, and auto-scaling.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Launch EC2 Instance (AWS SDK)
import { EC2Client, RunInstancesCommand } from '@aws-sdk/client-ec2';

const ec2Client = new EC2Client({ region: 'us-east-1' });

async function launchInstance() {
  const command = new RunInstancesCommand({
    ImageId: 'ami-0c55b159cbfafe1f0', // Amazon Linux 2
    MinCount: 1,
    MaxCount: 1,
    InstanceType: 't3.micro',
    KeyName: 'my-key-pair',
    SecurityGroupIds: ['sg-12345678'],
    UserData: Buffer.from(\`
      #!/bin/bash
      yum update -y
      yum install -y nginx
      systemctl start nginx
      systemctl enable nginx
    \`).toString('base64'),
    TagSpecifications: [{
      ResourceType: 'instance',
      Tags: [
        { Key: 'Name', Value: 'WebServer' },
        { Key: 'Environment', Value: 'Production' },
        { Key: 'ManagedBy', Value: 'CloudFormation' }
      ]
    }]
  });

  const response = await ec2Client.send(command);
  console.log('Instance ID:', response.Instances?.[0]?.InstanceId);
  return response;
}

// ✅ Security Group Configuration
const securityGroupConfig = {
  GroupName: 'web-server-sg',
  Description: 'Security group for web servers',
  VpcId: 'vpc-12345678',
  IpPermissions: [
    {
      IpProtocol: 'tcp',
      FromPort: 80,
      ToPort: 80,
      IpRanges: [{ CidrIp: '0.0.0.0/0', Description: 'HTTP from anywhere' }]
    },
    {
      IpProtocol: 'tcp',
      FromPort: 443,
      ToPort: 443,
      IpRanges: [{ CidrIp: '0.0.0.0/0', Description: 'HTTPS from anywhere' }]
    },
    {
      IpProtocol: 'tcp',
      FromPort: 22,
      ToPort: 22,
      IpRanges: [{ CidrIp: '10.0.0.0/8', Description: 'SSH from VPC only' }]
    }
  ]
};

// ✅ Auto Scaling Group (CloudFormation)
const autoScalingGroup = {
  Type: 'AWS::AutoScaling::AutoScalingGroup',
  Properties: {
    MinSize: 2,
    MaxSize: 10,
    DesiredCapacity: 3,
    VPCZoneIdentifier: ['subnet-12345678', 'subnet-87654321'],
    LaunchTemplate: {
      LaunchTemplateId: { Ref: 'LaunchTemplate' },
      Version: { 'Fn::GetAtt': ['LaunchTemplate', 'LatestVersionNumber'] }
    },
    TargetGroupARNs: [{ Ref: 'TargetGroup' }],
    HealthCheckType: 'ELB',
    HealthCheckGracePeriod: 300,
    Tags: [
      { Key: 'Name', Value: 'ASG-WebServers', PropagateAtLaunch: true }
    ]
  }
};

// ✅ Launch Template (Best Practice)
const launchTemplate = {
  Type: 'AWS::EC2::LaunchTemplate',
  Properties: {
    LaunchTemplateName: 'web-server-template',
    LaunchTemplateData: {
      ImageId: 'ami-0c55b159cbfafe1f0',
      InstanceType: 't3.medium',
      KeyName: 'my-key-pair',
      SecurityGroupIds: [{ Ref: 'SecurityGroup' }],
      IamInstanceProfile: { Arn: { 'Fn::GetAtt': ['InstanceProfile', 'Arn'] } },
      UserData: {
        'Fn::Base64': \`
          #!/bin/bash
          yum update -y
          yum install -y amazon-cloudwatch-agent
          /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \\
            -a fetch-config -m ec2 -c ssm:AmazonCloudWatch-linux -s
        \`
      }
    }
  }
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* S3 & Storage */}
      <section id="s3-storage" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. S3 & Storage Services
              </Heading>
              <Text className={styles.sectionDescription}>
                Master S3 buckets, object storage, versioning, lifecycle policies, and best practices for cost optimization.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Public bucket, no encryption, no versioning
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });

async function uploadFile(file: Buffer, key: string) {
  await s3Client.send(new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: key,
    Body: file
    // No encryption, no ACL, public access
  }));
}`}
              good={`// ✅ CORRECT: Secure, encrypted, versioned bucket
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: 'us-east-1' });

// ✅ Secure upload with encryption
async function uploadFile(file: Buffer, key: string) {
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ServerSideEncryption: 'AES256', // or 'aws:kms'
    ContentType: 'application/json',
    Metadata: {
      'uploaded-by': 'web-app',
      'upload-date': new Date().toISOString()
    }
  }));
}

// ✅ Generate presigned URL for secure access
async function getPresignedUrl(key: string, expiresIn: number = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// ✅ S3 Bucket Configuration (CloudFormation)
const s3Bucket = {
  Type: 'AWS::S3::Bucket',
  Properties: {
    BucketName: 'my-secure-bucket',
    VersioningConfiguration: {
      Status: 'Enabled'
    },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true
    },
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [{
        ServerSideEncryptionByDefault: {
          SSEAlgorithm: 'AES256'
        }
      }]
    },
    LifecycleConfiguration: {
      Rules: [
        {
          Id: 'MoveToGlacier',
          Status: 'Enabled',
          Transitions: [{
            Days: 90,
            StorageClass: 'GLACIER'
          }],
          ExpirationInDays: 365
        }
      ]
    },
    CorsConfiguration: {
      CorsRules: [{
        AllowedOrigins: ['https://example.com'],
        AllowedMethods: ['GET', 'PUT'],
        AllowedHeaders: ['*'],
        MaxAge: 3000
      }]
    }
  }
};

// ✅ S3 Event Notifications (Lambda trigger)
const s3EventNotification = {
  Type: 'AWS::S3::Bucket',
  Properties: {
    NotificationConfiguration: {
      LambdaConfigurations: [{
        Event: 's3:ObjectCreated:*',
        Function: { 'Fn::GetAtt': ['ProcessFileLambda', 'Arn'] },
        Filter: {
          S3Key: {
            Rules: [{ Name: 'prefix', Value: 'uploads/' }]
          }
        }
      }]
    }
  }
};`}
            />
          </Stack>
        </Card>
      </section>

      {/* Lambda & Serverless */}
      <section id="lambda-serverless" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Lambda & Serverless Architecture
              </Heading>
              <Text className={styles.sectionDescription}>
                Build serverless applications with Lambda, API Gateway, and event-driven architectures.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Lambda Function (TypeScript)
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId, fileName } = JSON.parse(event.body || '{}');

    // Process file from S3
    const s3Response = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: \`uploads/\${fileName}\`
    }));

    // Store metadata in DynamoDB
    await dynamoClient.send(new PutItemCommand({
      TableName: process.env.TABLE_NAME!,
      Item: {
        userId: { S: userId },
        fileName: { S: fileName },
        processedAt: { S: new Date().toISOString() }
      }
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'File processed successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// ✅ Lambda with Layers (Shared code)
// layer/nodejs/package.json
{
  "name": "shared-layer",
  "version": "1.0.0",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.0.0",
    "@aws-sdk/client-dynamodb": "^3.0.0"
  }
}

// ✅ Lambda Configuration (CloudFormation)
const lambdaFunction = {
  Type: 'AWS::Lambda::Function',
  Properties: {
    FunctionName: 'process-file',
    Runtime: 'nodejs18.x',
    Handler: 'index.handler',
    Code: {
      ZipFile: 'exports.handler = async (event) => { return { statusCode: 200 }; };'
    },
    Environment: {
      Variables: {
        BUCKET_NAME: { Ref: 'S3Bucket' },
        TABLE_NAME: { Ref: 'DynamoDBTable' }
      }
    },
    Role: { 'Fn::GetAtt': ['LambdaExecutionRole', 'Arn'] },
    Timeout: 30,
    MemorySize: 512,
    Layers: [{ Ref: 'SharedLayer' }],
    ReservedConcurrentExecutions: 10
  }
};

// ✅ API Gateway Integration
const apiGateway = {
  Type: 'AWS::ApiGateway::RestApi',
  Properties: {
    Name: 'file-processing-api',
    EndpointConfiguration: {
      Types: ['REGIONAL']
    }
  }
};

const apiMethod = {
  Type: 'AWS::ApiGateway::Method',
  Properties: {
    RestApiId: { Ref: 'ApiGateway' },
    ResourceId: { Ref: 'ApiResource' },
    HttpMethod: 'POST',
    AuthorizationType: 'AWS_IAM',
    Integration: {
      Type: 'AWS_PROXY',
      IntegrationHttpMethod: 'POST',
      Uri: {
        'Fn::Sub': 'arn:aws:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/\${LambdaFunction.Arn}/invocations'
      }
    }
  }
};

// ✅ EventBridge Rule (Event-driven)
const eventRule = {
  Type: 'AWS::Events::Rule',
  Properties: {
    Name: 'process-scheduled-files',
    ScheduleExpression: 'cron(0 2 * * ? *)', // Daily at 2 AM
    State: 'ENABLED',
    Targets: [{
      Arn: { 'Fn::GetAtt': ['LambdaFunction', 'Arn'] },
      Id: '1'
    }]
  }
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* RDS & Databases */}
      <section id="rds-databases" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. RDS & Database Services
              </Heading>
              <Text className={styles.sectionDescription}>
                Set up managed databases with RDS, DynamoDB, and understand when to use each.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ RDS PostgreSQL Instance (CloudFormation)
const rdsInstance = {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceIdentifier: 'production-db',
    Engine: 'postgres',
    EngineVersion: '15.4',
    DBInstanceClass: 'db.t3.medium',
    AllocatedStorage: 100,
    StorageType: 'gp3',
    StorageEncrypted: true,
    MasterUsername: { 'Fn::Sub': '{{resolve:ssm:/db/master-username}}' },
    MasterUserPassword: { 'Fn::Sub': '{{resolve:ssm-secure:/db/master-password}}' },
    DBName: 'myapp',
    VPCSecurityGroups: [{ Ref: 'DatabaseSecurityGroup' }],
    DBSubnetGroupName: { Ref: 'DBSubnetGroup' },
    BackupRetentionPeriod: 7,
    PreferredBackupWindow: '03:00-04:00',
    PreferredMaintenanceWindow: 'sun:04:00-sun:05:00',
    MultiAZ: true,
    PubliclyAccessible: false,
    DeletionProtection: true,
    EnablePerformanceInsights: true,
    PerformanceInsightsRetentionPeriod: 7,
    Tags: [
      { Key: 'Name', Value: 'Production-Database' },
      { Key: 'Environment', Value: 'Production' }
    ]
  }
};

// ✅ DynamoDB Table (NoSQL)
const dynamoTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: 'users',
    BillingMode: 'PAY_PER_REQUEST', // or 'PROVISIONED'
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'email-index',
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    }],
    StreamSpecification: {
      StreamViewType: 'NEW_AND_OLD_IMAGES'
    },
    PointInTimeRecoverySpecification: {
      PointInTimeRecoveryEnabled: true
    },
    Tags: [
      { Key: 'Name', Value: 'Users-Table' }
    ]
  }
};

// ✅ DynamoDB Access Pattern (TypeScript)
import { DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });

async function getUserByEmail(email: string) {
  const command = new QueryCommand({
    TableName: 'users',
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: marshall({
      ':email': email
    })
  });

  const response = await dynamoClient.send(command);
  return response.Items?.map(item => unmarshall(item));
}

async function createUser(user: { userId: string; email: string; name: string }) {
  const command = new PutItemCommand({
    TableName: 'users',
    Item: marshall({
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: new Date().toISOString()
    })
  });

  await dynamoClient.send(command);
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* VPC & Networking */}
      <section id="vpc-networking" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. VPC & Networking
              </Heading>
              <Text className={styles.sectionDescription}>
                Design secure network architectures with VPCs, subnets, route tables, and NAT gateways.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ VPC Configuration (CloudFormation)
const vpc = {
  Type: 'AWS::EC2::VPC',
  Properties: {
    CidrBlock: '10.0.0.0/16',
    EnableDnsHostnames: true,
    EnableDnsSupport: true,
    Tags: [{ Key: 'Name', Value: 'Production-VPC' }]
  }
};

// ✅ Public Subnets (for load balancers, NAT)
const publicSubnet1 = {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    VpcId: { Ref: 'VPC' },
    CidrBlock: '10.0.1.0/24',
    AvailabilityZone: { 'Fn::Select': [0, { 'Fn::GetAZs': '' }] },
    MapPublicIpOnLaunch: true,
    Tags: [{ Key: 'Name', Value: 'Public-Subnet-1' }]
  }
};

// ✅ Private Subnets (for application servers)
const privateSubnet1 = {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    VpcId: { Ref: 'VPC' },
    CidrBlock: '10.0.10.0/24',
    AvailabilityZone: { 'Fn::Select': [0, { 'Fn::GetAZs': '' }] },
    MapPublicIpOnLaunch: false,
    Tags: [{ Key: 'Name', Value: 'Private-Subnet-1' }]
  }
};

// ✅ Internet Gateway
const internetGateway = {
  Type: 'AWS::EC2::InternetGateway',
  Properties: {
    Tags: [{ Key: 'Name', Value: 'Production-IGW' }]
  }
};

const internetGatewayAttachment = {
  Type: 'AWS::EC2::VPCGatewayAttachment',
  Properties: {
    VpcId: { Ref: 'VPC' },
    InternetGatewayId: { Ref: 'InternetGateway' }
  }
};

// ✅ NAT Gateway (for private subnet internet access)
const natGateway = {
  Type: 'AWS::EC2::NatGateway',
  Properties: {
    AllocationId: { 'Fn::GetAtt': ['NatGatewayEIP', 'AllocationId'] },
    SubnetId: { Ref: 'PublicSubnet1' },
    Tags: [{ Key: 'Name', Value: 'Production-NAT' }]
  }
};

// ✅ Route Tables
const publicRouteTable = {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: { Ref: 'VPC' },
    Tags: [{ Key: 'Name', Value: 'Public-RouteTable' }]
  }
};

const publicRoute = {
  Type: 'AWS::EC2::Route',
  Properties: {
    RouteTableId: { Ref: 'PublicRouteTable' },
    DestinationCidrBlock: '0.0.0.0/0',
    GatewayId: { Ref: 'InternetGateway' }
  },
  DependsOn: 'InternetGatewayAttachment'
};

const privateRouteTable = {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: { Ref: 'VPC' },
    Tags: [{ Key: 'Name', Value: 'Private-RouteTable' }]
  }
};

const privateRoute = {
  Type: 'AWS::EC2::Route',
  Properties: {
    RouteTableId: { Ref: 'PrivateRouteTable' },
    DestinationCidrBlock: '0.0.0.0/0',
    NatGatewayId: { Ref: 'NatGateway' }
  }
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* IAM & Security */}
      <section id="iam-security" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                7. IAM & Security Best Practices
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement least privilege access, IAM roles, policies, and security best practices.
              </Text>
            </div>

            <CodeComparison
              language="json"
              wrong={`// ❌ WRONG: Overly permissive policy
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "*",
    "Resource": "*"
  }]
}`}
              good={`// ✅ CORRECT: Least privilege policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/uploads/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-server-side-encryption": "AES256"
        }
      }
    },
    {
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "*",
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}

// ✅ IAM Role for Lambda (CloudFormation)
const lambdaExecutionRole = {
  Type: 'AWS::IAM::Role',
  Properties: {
    RoleName: 'lambda-execution-role',
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Principal: {
          Service: 'lambda.amazonaws.com'
        },
        Action: 'sts:AssumeRole'
      }]
    },
    ManagedPolicyArns: [
      'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
    ],
    Policies: [{
      PolicyName: 'S3Access',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Action: [
            's3:GetObject',
            's3:PutObject'
          ],
          Resource: {
            'Fn::Sub': 'arn:aws:s3:::\${S3Bucket}/*'
          }
        }]
      }
    }]
  }
};

// ✅ Instance Profile for EC2
const instanceProfile = {
  Type: 'AWS::IAM::InstanceProfile',
  Properties: {
    Roles: [{ Ref: 'EC2Role' }]
  }
};

const ec2Role = {
  Type: 'AWS::IAM::Role',
  Properties: {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Principal: {
          Service: 'ec2.amazonaws.com'
        },
        Action: 'sts:AssumeRole'
      }]
    },
    Policies: [{
      PolicyName: 'CloudWatchLogs',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Action: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents'
          ],
          Resource: '*'
        }]
      }
    }]
  }
};`}
            />
          </Stack>
        </Card>
      </section>

      {/* CloudFormation & IaC */}
      <section id="cloudformation-iac" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                8. CloudFormation & Infrastructure as Code
              </Heading>
              <Text className={styles.sectionDescription}>
                Define and deploy infrastructure using CloudFormation templates and best practices.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Complete CloudFormation Template
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "Production web application stack",
  "Parameters": {
    "Environment": {
      "Type": "String",
      "Default": "production",
      "AllowedValues": ["development", "staging", "production"]
    },
    "InstanceType": {
      "Type": "String",
      "Default": "t3.medium",
      "AllowedValues": ["t3.micro", "t3.small", "t3.medium"]
    }
  },
  "Mappings": {
    "RegionMap": {
      "us-east-1": {
        "AMI": "ami-0c55b159cbfafe1f0"
      },
      "eu-west-1": {
        "AMI": "ami-0d729a60"
      }
    }
  },
  "Resources": {
    "VPC": {
      "Type": "AWS::EC2::VPC",
      "Properties": {
        "CidrBlock": "10.0.0.0/16",
        "EnableDnsHostnames": true,
        "EnableDnsSupport": true,
        "Tags": [
          { "Key": "Name", "Value": { "Fn::Sub": "\${AWS::StackName}-VPC" } }
        ]
      }
    }
  },
  "Outputs": {
    "VPCId": {
      "Description": "VPC ID",
      "Value": { "Ref": "VPC" },
      "Export": {
        "Name": { "Fn::Sub": "\${AWS::StackName}-VPCId" }
      }
    }
  }
}

// ✅ Nested Stacks (Modular architecture)
const nestedStack = {
  Type: 'AWS::CloudFormation::Stack',
  Properties: {
    TemplateURL: 'https://s3.amazonaws.com/templates/network-stack.yaml',
    Parameters: {
      VpcCidr: '10.0.0.0/16'
    }
  }
};

// ✅ Stack deployment (AWS CLI)
# aws cloudformation create-stack \\
  --stack-name production-stack \\
  --template-body file://template.yaml \\
  --parameters ParameterKey=Environment,ParameterValue=production \\
  --capabilities CAPABILITY_IAM

# Update stack
# aws cloudformation update-stack \\
  --stack-name production-stack \\
  --template-body file://template.yaml

# Delete stack
# aws cloudformation delete-stack --stack-name production-stack`}
              language="json"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* CI/CD with AWS */}
      <section id="cicd" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                9. CI/CD with AWS
              </Heading>
              <Text className={styles.sectionDescription}>
                Set up continuous integration and deployment pipelines with CodePipeline, CodeBuild, and CodeDeploy.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ CodePipeline Configuration (CloudFormation)
const pipeline = {
  Type: 'AWS::CodePipeline::Pipeline',
  Properties: {
    Name: 'production-pipeline',
    RoleArn: { 'Fn::GetAtt': ['CodePipelineRole', 'Arn'] },
    ArtifactStore: {
      Type: 'S3',
      Location: { Ref: 'ArtifactBucket' }
    },
    Stages: [
      {
        Name: 'Source',
        Actions: [{
          Name: 'SourceAction',
          ActionTypeId: {
            Category: 'Source',
            Owner: 'AWS',
            Provider: 'CodeCommit',
            Version: '1'
          },
          OutputArtifacts: [{ Name: 'SourceOutput' }],
          Configuration: {
            RepositoryName: { Ref: 'CodeRepository' },
            BranchName: 'main'
          }
        }]
      },
      {
        Name: 'Build',
        Actions: [{
          Name: 'BuildAction',
          ActionTypeId: {
            Category: 'Build',
            Owner: 'AWS',
            Provider: 'CodeBuild',
            Version: '1'
          },
          InputArtifacts: [{ Name: 'SourceOutput' }],
          OutputArtifacts: [{ Name: 'BuildOutput' }],
          Configuration: {
            ProjectName: { Ref: 'CodeBuildProject' }
          }
        }]
      },
      {
        Name: 'Deploy',
        Actions: [{
          Name: 'DeployAction',
          ActionTypeId: {
            Category: 'Deploy',
            Owner: 'AWS',
            Provider: 'CloudFormation',
            Version: '1'
          },
          InputArtifacts: [{ Name: 'BuildOutput' }],
          Configuration: {
            StackName: 'production-stack',
            ActionMode: 'CREATE_UPDATE',
            Capabilities: 'CAPABILITY_IAM',
            TemplatePath: 'BuildOutput::template.yaml'
          }
        }]
      }
    ]
  }
};

// ✅ CodeBuild Project
const codeBuildProject = {
  Type: 'AWS::CodeBuild::Project',
  Properties: {
    Name: 'build-project',
    ServiceRole: { 'Fn::GetAtt': ['CodeBuildRole', 'Arn'] },
    Artifacts: {
      Type: 'CODEPIPELINE'
    },
    Environment: {
      Type: 'LINUX_CONTAINER',
      ComputeType: 'BUILD_GENERAL1_SMALL',
      Image: 'aws/codebuild/standard:5.0',
      EnvironmentVariables: [
        {
          Name: 'NODE_ENV',
          Value: 'production'
        }
      ]
    },
    Source: {
      Type: 'CODEPIPELINE',
      BuildSpec: 'buildspec.yaml'
    }
  }
};

// ✅ buildspec.yaml
# version: 0.2
# phases:
#   pre_build:
#     commands:
#       - echo Logging in to Amazon ECR...
#       - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
#   build:
#     commands:
#       - echo Build started on \`date\`
#       - npm install
#       - npm run build
#       - npm run test
#   post_build:
#     commands:
#       - echo Build completed on \`date\`
# artifacts:
#   files:
#     - '**/*'
#   name: build-output`}
              language="yaml"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Architecture Patterns */}
      <section id="architecture-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                10. Architecture Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Common AWS architecture patterns: Three-tier, serverless, microservices, and event-driven architectures.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Three-Tier Architecture Pattern
// 1. Presentation Tier: ALB + EC2 Auto Scaling Group
// 2. Application Tier: EC2 Auto Scaling Group (Private Subnets)
// 3. Data Tier: RDS Multi-AZ + ElastiCache

// ✅ Serverless Architecture Pattern
// API Gateway → Lambda → DynamoDB
// S3 → Lambda → SNS → Lambda
// EventBridge → Lambda → Step Functions

// ✅ Microservices Pattern
// Each service: API Gateway + Lambda + DynamoDB
// Service discovery: API Gateway or Service Mesh
// Inter-service communication: EventBridge or SQS

// ✅ Event-Driven Architecture
const eventDrivenPattern = {
  // S3 upload triggers Lambda
  s3Upload: {
    source: 'S3',
    event: 'ObjectCreated',
    target: 'Lambda',
    function: 'process-file'
  },
  // Lambda publishes to SNS
  snsNotification: {
    source: 'Lambda',
    target: 'SNS',
    topic: 'file-processed',
    subscribers: ['email-lambda', 'analytics-lambda']
  },
  // EventBridge for cross-service events
  eventBridge: {
    source: 'CustomApp',
    detailType: 'OrderPlaced',
    target: 'OrderProcessingStepFunction'
  }
};

// ✅ Well-Architected Framework Principles
const wellArchitectedPrinciples = {
  operationalExcellence: {
    automation: 'CloudFormation, CodePipeline',
    monitoring: 'CloudWatch, X-Ray',
    documentation: 'Runbooks, Architecture diagrams'
  },
  security: {
    identity: 'IAM, MFA, SSO',
    detection: 'CloudTrail, GuardDuty',
    infrastructure: 'VPC, Security Groups, WAF'
  },
  reliability: {
    foundations: 'Multi-AZ, Auto Scaling',
    changeManagement: 'Blue/Green, Canary deployments',
    failureManagement: 'Health checks, Circuit breakers'
  },
  performanceEfficiency: {
    selection: 'Right instance types, storage classes',
    review: 'Performance testing, optimization',
    monitoring: 'CloudWatch metrics, alarms'
  },
  costOptimization: {
    rightSizing: 'Instance types, storage tiers',
    reservedInstances: 'Savings Plans, Reserved Instances',
    monitoring: 'Cost Explorer, Budgets'
  }
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Cost Optimization */}
      <section id="cost-optimization" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                11. Cost Optimization
              </Heading>
              <Text className={styles.sectionDescription}>
                Reduce AWS costs with right-sizing, reserved instances, spot instances, and cost monitoring.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Cost Optimization Strategies

// 1. Right-Sizing Instances
// Use CloudWatch metrics to identify over-provisioned instances
// Downsize: t3.large → t3.medium if CPU < 40%
// Upsize: t3.micro → t3.small if CPU > 80%

// 2. Reserved Instances & Savings Plans
// Compute Savings Plan: Up to 72% savings
// EC2 Instance Savings Plan: Up to 72% savings
// Reserved Instances: Up to 75% savings (1-3 year terms)

// 3. Spot Instances (for fault-tolerant workloads)
const spotFleetRequest = {
  Type: 'AWS::EC2::SpotFleetRequest',
  Properties: {
    SpotFleetRequestConfig: {
      IamFleetRole: { 'Fn::GetAtt': ['SpotFleetRole', 'Arn'] },
      TargetCapacity: 10,
      LaunchSpecifications: [{
        ImageId: 'ami-0c55b159cbfafe1f0',
        InstanceType: 't3.medium',
        SpotPrice: '0.05',
        SubnetId: { Ref: 'PrivateSubnet1' }
      }],
      AllocationStrategy: 'lowestPrice'
    }
  }
};

// 4. S3 Lifecycle Policies
const s3Lifecycle = {
  Rules: [
    {
      Id: 'MoveToIA',
      Status: 'Enabled',
      Transitions: [{
        Days: 30,
        StorageClass: 'STANDARD_IA'
      }]
    },
    {
      Id: 'MoveToGlacier',
      Status: 'Enabled',
      Transitions: [{
        Days: 90,
        StorageClass: 'GLACIER'
      }]
    },
    {
      Id: 'DeleteOldVersions',
      Status: 'Enabled',
      NoncurrentVersionExpiration: {
        NoncurrentDays: 365
      }
    }
  ]
};

// 5. Auto Scaling (Scale down during off-hours)
const scheduledScaling = {
  Type: 'AWS::AutoScaling::ScheduledAction',
  Properties: {
    AutoScalingGroupName: { Ref: 'AutoScalingGroup' },
    ScheduledActionName: 'scale-down-evening',
    Recurrence: '0 20 * * *', // 8 PM daily
    MinSize: 1,
    MaxSize: 3,
    DesiredCapacity: 1
  }
};

// 6. Cost Monitoring & Budgets
const budget = {
  Type: 'AWS::Budgets::Budget',
  Properties: {
    Budget: {
      BudgetName: 'monthly-budget',
      BudgetLimit: {
        Amount: '1000',
        Unit: 'USD'
      },
      TimeUnit: 'MONTHLY',
      BudgetType: 'COST'
    },
    NotificationsWithSubscribers: [{
      Notification: {
        NotificationType: 'ACTUAL',
        ComparisonOperator: 'GREATER_THAN',
        Threshold: 80
      },
      Subscribers: [{
        SubscriptionType: 'EMAIL',
        Address: 'admin@example.com'
      }]
    }]
  }
};

// 7. Cost Allocation Tags
// Tag all resources for cost tracking
const resourceTags = [
  { Key: 'Environment', Value: 'Production' },
  { Key: 'Project', Value: 'WebApp' },
  { Key: 'Team', Value: 'Engineering' },
  { Key: 'CostCenter', Value: 'IT-001' }
];`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Monitoring & CloudWatch */}
      <section id="monitoring-cloudwatch" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                12. Monitoring & CloudWatch
              </Heading>
              <Text className={styles.sectionDescription}>
                Set up comprehensive monitoring with CloudWatch, alarms, dashboards, and logging.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ CloudWatch Alarm (CloudFormation)
const cpuAlarm = {
  Type: 'AWS::CloudWatch::Alarm',
  Properties: {
    AlarmName: 'high-cpu-utilization',
    AlarmDescription: 'Alert when CPU exceeds 80%',
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    Statistic: 'Average',
    Period: 300,
    EvaluationPeriods: 2,
    Threshold: 80,
    ComparisonOperator: 'GreaterThanThreshold',
    Dimensions: [{
      Name: 'InstanceId',
      Value: { Ref: 'EC2Instance' }
    }],
    AlarmActions: [{ Ref: 'SNSTopic' }],
    OKActions: [{ Ref: 'SNSTopic' }]
  }
};

// ✅ CloudWatch Dashboard
const dashboard = {
  Type: 'AWS::CloudWatch::Dashboard',
  Properties: {
    DashboardName: 'production-dashboard',
    DashboardBody: JSON.stringify({
      widgets: [
        {
          type: 'metric',
          properties: {
            metrics: [
              ['AWS/EC2', 'CPUUtilization', { stat: 'Average' }],
              ['AWS/ApplicationELB', 'TargetResponseTime', { stat: 'Average' }]
            ],
            period: 300,
            stat: 'Average',
            region: 'us-east-1',
            title: 'System Metrics'
          }
        }
      ]
    })
  }
};

// ✅ CloudWatch Logs Group
const logGroup = {
  Type: 'AWS::Logs::LogGroup',
  Properties: {
    LogGroupName: '/aws/lambda/my-function',
    RetentionInDays: 30
  }
};

// ✅ Custom Metrics (from application)
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatchClient({ region: 'us-east-1' });

async function publishCustomMetric(metricName: string, value: number) {
  await cloudwatch.send(new PutMetricDataCommand({
    Namespace: 'MyApplication',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Timestamp: new Date(),
      Unit: 'Count'
    }]
  }));
}

// ✅ CloudWatch Insights Query
// Query logs for errors
// fields @timestamp, @message
// | filter @message like /ERROR/
// | sort @timestamp desc
// | limit 100

// ✅ X-Ray Tracing (Lambda)
import { XRayClient } from '@aws-xray-sdk-core';
import AWS from 'aws-sdk';

const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

export const handler = async (event) => {
  const segment = AWSXRay.getSegment();
  const subsegment = segment.addNewSubsegment('process-data');
  
  try {
    // Your code here
    subsegment.close();
  } catch (error) {
    subsegment.addError(error);
    subsegment.close();
    throw error;
  }
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

