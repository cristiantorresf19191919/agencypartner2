"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import { useBlogPostContent } from "@/lib/blogTranslations";
import { getCategoryForPost } from "@/lib/blogCategories";
import styles from "../BlogPostPage.module.css";

export default function TerraformPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent('terraform', language);
  const category = getCategoryForPost("terraform");

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
            {postContent?.breadcrumbLabel || 'Terraform'}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || 'Terraform: Infrastructure as Code Mastery'}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle || 'Complete Terraform guide from fundamentals to advanced. Learn Infrastructure as Code principles, state management, modules, workspaces, provisioners, and production-ready patterns used by senior DevOps engineers. Master Terraform step-by-step with extensive real-world examples.'}
        </Text>
      </div>

      {/* Terraform Fundamentals */}
      <section id="terraform-fundamentals" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Terraform Fundamentals & Installation
              </Heading>
              <Text className={styles.sectionDescription}>
                Understand what Infrastructure as Code (IaC) is, why Terraform is essential, and how to install and configure it properly.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>What is Terraform?</strong>
                <br />• <strong>Infrastructure as Code:</strong> Define and manage infrastructure using declarative configuration files
                <br />• <strong>Multi-Cloud:</strong> Works with AWS, Azure, GCP, and 100+ providers
                <br />• <strong>State Management:</strong> Tracks infrastructure state to manage resources
                <br />• <strong>Idempotent:</strong> Apply same configuration multiple times safely
                <br />• <strong>Plan Before Apply:</strong> Preview changes before making them
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Installation on macOS
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# ✅ Installation on Linux
wget -O- https://apt.releases.hashicorp.com/gpg | \\
  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \\
  https://apt.releases.hashicorp.com \$(lsb_release -cs) main" | \\
  sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# ✅ Installation on Windows (Chocolatey)
choco install terraform

# ✅ Verify Installation
terraform version
# Terraform v1.6.0
# on darwin_amd64

# ✅ Initialize Terraform (creates .terraform directory)
terraform init

# ✅ Check Configuration Syntax
terraform validate

# ✅ Format Configuration Files
terraform fmt

# ✅ Plan Changes (Preview)
terraform plan

# ✅ Apply Changes
terraform apply

# ✅ Apply with Auto-Approval (for CI/CD)
terraform apply -auto-approve

# ✅ Destroy Infrastructure
terraform destroy`}
              language="bash"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Basic Configuration */}
      <section id="basic-configuration" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Basic Configuration: Your First Terraform File
              </Heading>
              <Text className={styles.sectionDescription}>
                Learn the fundamental building blocks: providers, resources, variables, and outputs. Create your first infrastructure.
              </Text>
            </div>

            <CodeComparison
              language="hcl"
              wrong={`# ❌ WRONG: Hard-coded values, no structure, no variables
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}

# Problems:
# - Hard-coded AMI (may be region-specific)
# - No tags
# - No security group
# - No output
# - Hard to reuse or modify`}
              good={`# ✅ CORRECT: Well-structured with variables and outputs
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Provider Configuration
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = "terraform-tutorial"
      ManagedBy   = "Terraform"
    }
  }
}

# Variable Definitions
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

# Data Source (lookup AMI dynamically)
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group
resource "aws_security_group" "web" {
  name        = "\${var.environment}-web-sg"
  description = "Security group for web server"
  
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "\${var.environment}-web-sg"
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y nginx
    systemctl start nginx
    systemctl enable nginx
  EOF
  
  tags = {
    Name        = "\${var.environment}-web-server"
    Type        = "web"
  }
}

# Output Values
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.web.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.web.public_dns
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* Variables and Outputs */}
      <section id="variables-outputs" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Variables, Outputs, and Data Sources
              </Heading>
              <Text className={styles.sectionDescription}>
                Master variables for configurability, outputs for exposing values, and data sources for querying existing infrastructure.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Variables: Input Values (variables.tf)
# String Variable
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "my-project"
}

# Number Variable
variable "instance_count" {
  description = "Number of EC2 instances"
  type        = number
  default     = 1
  
  validation {
    condition     = var.instance_count > 0 && var.instance_count <= 10
    error_message = "Instance count must be between 1 and 10."
  }
}

# Boolean Variable
variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring"
  type        = bool
  default     = true
}

# List Variable
variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# Map Variable
variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Team        = "devops"
    CostCenter  = "engineering"
  }
}

# Object Variable (Complex)
variable "database_config" {
  description = "Database configuration"
  type = object({
    engine         = string
    engine_version = string
    instance_class = string
    allocated_storage = number
    backup_retention_period = number
  })
  default = {
    engine                  = "postgres"
    engine_version          = "15.4"
    instance_class          = "db.t3.micro"
    allocated_storage       = 20
    backup_retention_period = 7
  }
}

# Set Variable (unique values)
variable "allowed_cidr_blocks" {
  description = "Allowed CIDR blocks for security group"
  type        = set(string)
  default     = ["10.0.0.0/8", "172.16.0.0/12"]
}

# Tuple Variable (ordered list with specific types)
variable "network_config" {
  description = "Network configuration"
  type        = tuple([string, number, bool])
  default     = ["10.0.0.0/16", 3, true]  # [cidr, subnet_count, enable_nat]
}

# ✅ Variable Files
# terraform.tfvars (default)
project_name = "production"
instance_count = 3
enable_monitoring = true

# dev.tfvars
project_name = "development"
instance_count = 1
enable_monitoring = false

# prod.tfvars
project_name = "production"
instance_count = 5
enable_monitoring = true

# Apply with specific var file:
# terraform apply -var-file="prod.tfvars"

# ✅ Environment Variables
# TF_VAR_project_name=my-project terraform apply
# Prefix variables with TF_VAR_ to set via environment

# ✅ Outputs: Exposing Values (outputs.tf)
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
  sensitive   = false
}

output "instance_ids" {
  description = "IDs of EC2 instances"
  value       = aws_instance.web[*].id
}

output "database_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true  # Hide sensitive values
}

output "complete_config" {
  description = "Complete configuration as object"
  value = {
    vpc_id        = aws_vpc.main.id
    subnet_ids    = aws_subnet.main[*].id
    instance_ips  = aws_instance.web[*].private_ip
  }
  
  # Precondition validation
  precondition {
    condition     = length(aws_instance.web) > 0
    error_message = "At least one instance must be created."
  }
}

# ✅ Data Sources: Query Existing Infrastructure
# Get current AWS account information
data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

# Get available availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Get VPC information
data "aws_vpc" "existing" {
  id = "vpc-12345678"
}

# Or by tags
data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["main-vpc"]
  }
}

# Get AMI dynamically
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Get subnet by filter
data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  
  tags = {
    Type = "private"
  }
}

# ✅ Using Data Sources
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  subnet_id     = data.aws_subnets.private.ids[0]
  
  tags = {
    AccountId = data.aws_caller_identity.current.account_id
    Region    = data.aws_region.current.name
  }
}`}
              language="hcl"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* State Management */}
      <section id="state-management" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. State Management: The Heart of Terraform
              </Heading>
              <Text className={styles.sectionDescription}>
                Understand Terraform state, why it's critical, and how to manage it properly with remote backends.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>What is Terraform State?</strong>
                <br />• <strong>State File:</strong> Maps your configuration to real-world infrastructure
                <br />• <strong>Metadata:</strong> Stores resource IDs, dependencies, and attribute values
                <br />• <strong>Idempotency:</strong> Enables Terraform to know what exists vs. what to create
                <br />• <strong>Backend:</strong> Where state is stored (local file, S3, Terraform Cloud, etc.)
                <br />• <strong>State Locking:</strong> Prevents concurrent modifications
              </Text>
            </div>

            <CodeComparison
              language="hcl"
              wrong={`# ❌ WRONG: Local state (not for production)
# No backend configuration = local state file (terraform.tfstate)

# Problems:
# - Not shared between team members
# - Risk of losing state file
# - No state locking
# - Can't collaborate safely
# - State file may contain secrets`}
              good={`# ✅ CORRECT: Remote Backend (S3 + DynamoDB)
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
    
    # Optional: Versioning for state recovery
    # versioning {
    #   enabled = true
    # }
  }
}

# ✅ Remote Backend Alternatives

# Option 1: S3 Backend with DynamoDB Locking
terraform {
  backend "s3" {
    bucket         = "terraform-state-2024"
    key            = "apps/web-app/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
    
    # Enable server-side encryption
    # kms_key_id = "arn:aws:kms:us-east-1:123456789012:key/abc123"
  }
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_state_lock" {
  name           = "terraform-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
  
  tags = {
    Name = "Terraform State Lock Table"
    Purpose = "Terraform state locking"
  }
}

# Option 2: Terraform Cloud Backend
terraform {
  cloud {
    organization = "my-company"
    
    workspaces {
      name = "production"
    }
  }
}

# Option 3: Azure Backend
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state"
    storage_account_name = "terraformstate2024"
    container_name       = "tfstate"
    key                  = "production.terraform.tfstate"
  }
}

# Option 4: GCS Backend
terraform {
  backend "gcs" {
    bucket = "terraform-state-bucket"
    prefix = "production"
  }
}

# ✅ State Management Commands
# Initialize backend
terraform init

# View current state
terraform show

# List resources in state
terraform state list

# Get specific resource from state
terraform state show aws_instance.web

# Move resource in state (rename)
terraform state mv aws_instance.web aws_instance.old_web

# Remove resource from state (without destroying)
terraform state rm aws_instance.web

# Import existing resource into state
terraform import aws_instance.web i-1234567890abcdef0

# Refresh state (reconcile with real infrastructure)
terraform refresh

# Force unlock (if stuck)
terraform force-unlock <LOCK_ID>`}
            />
          </Stack>
        </Card>
      </section>

      {/* Modules */}
      <section id="modules" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Modules: Reusability and Organization
              </Heading>
              <Text className={styles.sectionDescription}>
                Create reusable modules to organize code, reduce duplication, and maintain consistency across environments.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Module Structure
# modules/ec2-instance/
#   ├── main.tf          # Resource definitions
#   ├── variables.tf     # Input variables
#   ├── outputs.tf       # Output values
#   ├── README.md        # Documentation
#   └── versions.tf      # Version constraints

# ✅ Example: EC2 Instance Module
# modules/ec2-instance/main.tf
resource "aws_instance" "this" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  vpc_security_group_ids = var.security_group_ids
  subnet_id              = var.subnet_id
  
  user_data = var.user_data
  
  tags = merge(
    var.tags,
    {
      Name = var.name
      Type = "ec2-instance"
    }
  )
}

# modules/ec2-instance/variables.tf
variable "name" {
  description = "Name of the instance"
  type        = string
}

variable "ami_id" {
  description = "AMI ID to use"
  type        = string
}

variable "instance_type" {
  description = "Instance type"
  type        = string
  default     = "t3.micro"
}

variable "subnet_id" {
  description = "Subnet ID"
  type        = string
}

variable "security_group_ids" {
  description = "List of security group IDs"
  type        = list(string)
  default     = []
}

variable "user_data" {
  description = "User data script"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}

# modules/ec2-instance/outputs.tf
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.this.id
}

output "instance_arn" {
  description = "ARN of the EC2 instance"
  value       = aws_instance.this.arn
}

output "instance_public_ip" {
  description = "Public IP address"
  value       = aws_instance.this.public_ip
}

output "instance_private_ip" {
  description = "Private IP address"
  value       = aws_instance.this.private_ip
}

# ✅ Using Local Modules
# root/main.tf
module "web_server" {
  source = "./modules/ec2-instance"
  
  name           = "web-server"
  ami_id         = data.aws_ami.amazon_linux.id
  instance_type  = "t3.small"
  subnet_id      = aws_subnet.public[0].id
  security_group_ids = [aws_security_group.web.id]
  
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y nginx
    systemctl start nginx
  EOF
  
  tags = {
    Environment = "production"
    Role        = "web"
  }
}

# ✅ Using Registry Modules
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  
  name = "my-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  
  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}

# ✅ Using Git Modules
module "database" {
  source = "git::https://github.com/myorg/terraform-modules.git//database?ref=v1.0.0"
  
  db_name     = "mydb"
  db_username = "admin"
  db_password = var.db_password
}

# ✅ Using S3 Modules
module "lambda" {
  source = "s3::https://s3.amazonaws.com/my-bucket/modules/lambda.zip"
  
  function_name = "my-function"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
}

# ✅ Complex Module: Web Application Stack
# modules/web-app/main.tf
# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = merge(var.tags, {
    Name = "\${var.name}-vpc"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = merge(var.tags, {
    Name = "\${var.name}-igw"
  })
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = var.availability_zones_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = merge(var.tags, {
    Name = "\${var.name}-public-subnet-\${count.index + 1}"
    Type = "public"
  })
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = var.availability_zones_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = merge(var.tags, {
    Name = "\${var.name}-private-subnet-\${count.index + 1}"
    Type = "private"
  })
}

# Using the module
module "production_app" {
  source = "./modules/web-app"
  
  name                    = "production"
  vpc_cidr                = "10.0.0.0/16"
  availability_zones_count = 3
  
  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}`}
              language="hcl"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Workspaces */}
      <section id="workspaces" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Workspaces: Managing Multiple Environments
              </Heading>
              <Text className={styles.sectionDescription}>
                Use workspaces to manage multiple environments (dev, staging, prod) with the same configuration.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Workspace Commands
# List workspaces
terraform workspace list
#   default
# * production

# Create new workspace
terraform workspace new dev
terraform workspace new staging

# Select workspace
terraform workspace select dev

# Show current workspace
terraform workspace show

# Delete workspace (must switch away first)
terraform workspace select default
terraform workspace delete dev

# ✅ Using Workspaces in Configuration
# Different resource names per environment
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  tags = {
    Name        = "\${terraform.workspace}-web-server"
    Environment = terraform.workspace
  }
}

# ✅ Workspace-Specific Variables
# Option 1: Separate variable files
# terraform.tfvars (default)
# dev.tfvars
# staging.tfvars
# prod.tfvars

# Apply with workspace and var file
terraform workspace select dev
terraform apply -var-file="dev.tfvars"

# Option 2: Workspace-aware defaults
variable "instance_count" {
  description = "Number of instances"
  type        = number
  default = {
    default   = 1
    dev       = 1
    staging   = 2
    production = 3
  }[terraform.workspace]
}

variable "instance_type" {
  description = "Instance type"
  type        = string
  default = {
    default   = "t3.micro"
    dev       = "t3.micro"
    staging   = "t3.small"
    production = "t3.medium"
  }[terraform.workspace]
}

# ✅ Complete Example: Multi-Environment Setup
# main.tf
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket = "terraform-state-2024"
    key    = "apps/web-app/\${terraform.workspace}/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = terraform.workspace
      ManagedBy   = "Terraform"
    }
  }
}

# Workspace-specific configuration
locals {
  environment_config = {
    default = {
      instance_count  = 1
      instance_type   = "t3.micro"
      enable_backup   = false
    }
    dev = {
      instance_count  = 1
      instance_type   = "t3.micro"
      enable_backup   = false
    }
    staging = {
      instance_count  = 2
      instance_type   = "t3.small"
      enable_backup   = true
    }
    production = {
      instance_count  = 3
      instance_type   = "t3.medium"
      enable_backup   = true
    }
  }
  
  config = local.environment_config[terraform.workspace]
}

# Resources using workspace config
resource "aws_instance" "web" {
  count         = local.config.instance_count
  ami           = data.aws_ami.amazon_linux.id
  instance_type = local.config.instance_type
  
  tags = {
    Name = "\${terraform.workspace}-web-\${count.index + 1}"
  }
}

# ✅ Workspace Outputs
output "workspace" {
  value = terraform.workspace
}

output "instance_ids" {
  value = aws_instance.web[*].id
}

# ✅ Best Practices for Workspaces
# 1. Use workspaces for environments with similar structure
# 2. Use separate root modules for drastically different environments
# 3. Always specify workspace in CI/CD pipelines
# 4. Use workspace-specific backend keys
# 5. Consider using Terraform Cloud for workspace management`}
              language="hcl"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Real-World Examples */}
      <section id="real-world-examples" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                7. Real-World Examples: Complete Infrastructure
              </Heading>
              <Text className={styles.sectionDescription}>
                Build complete, production-ready infrastructure stacks with Terraform.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Example 1: Complete VPC with Public/Private Subnets
# vpc.tf
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "main-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "main-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "public-subnet-\${count.index + 1}"
    Type = "public"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "private-subnet-\${count.index + 1}"
    Type = "private"
  }
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  count  = 3
  domain = "vpc"
  
  tags = {
    Name = "nat-eip-\${count.index + 1}"
  }
  
  depends_on = [aws_internet_gateway.main]
}

# NAT Gateway
resource "aws_nat_gateway" "main" {
  count         = 3
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
  
  tags = {
    Name = "nat-gateway-\${count.index + 1}"
  }
  
  depends_on = [aws_internet_gateway.main]
}

# Route Table for Public Subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name = "public-rt"
  }
}

# Route Table Associations for Public Subnets
resource "aws_route_table_association" "public" {
  count          = 3
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Route Tables for Private Subnets
resource "aws_route_table" "private" {
  count  = 3
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }
  
  tags = {
    Name = "private-rt-\${count.index + 1}"
  }
}

# Route Table Associations for Private Subnets
resource "aws_route_table_association" "private" {
  count          = 3
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# ✅ Example 2: Auto Scaling Group with Load Balancer
# Load Balancer
resource "aws_lb" "main" {
  name               = "main-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = false
  
  tags = {
    Name = "main-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "web" {
  name     = "web-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
  }
  
  tags = {
    Name = "web-target-group"
  }
}

# ALB Listener
resource "aws_lb_listener" "web" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# Launch Template
resource "aws_launch_template" "web" {
  name_prefix   = "web-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    yum install -y nginx
    echo "<h1>Hello from \$(hostname)</h1>" > /usr/share/nginx/html/index.html
    systemctl start nginx
    systemctl enable nginx
  EOF
  )
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "web-server"
    }
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "web" {
  name                = "web-asg"
  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300
  
  min_size         = 2
  max_size         = 10
  desired_capacity = 3
  
  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "web-server"
    propagate_at_launch = true
  }
}

# Auto Scaling Policies
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "scale-up"
  autoscaling_group_name = aws_autoscaling_group.web.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = 1
  cooldown               = 300
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "scale-down"
  autoscaling_group_name = aws_autoscaling_group.web.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = -1
  cooldown               = 300
}

# CloudWatch Alarm for CPU High
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "web-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This metric monitors ec2 cpu utilization"
  
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.web.name
  }
  
  alarm_actions = [aws_autoscaling_policy.scale_up.arn]
}

# CloudWatch Alarm for CPU Low
resource "aws_cloudwatch_metric_alarm" "cpu_low" {
  alarm_name          = "web-cpu-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 20
  alarm_description   = "This metric monitors ec2 cpu utilization"
  
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.web.name
  }
  
  alarm_actions = [aws_autoscaling_policy.scale_down.arn]
}

# ✅ Example 3: RDS Database with Multi-AZ
resource "aws_db_subnet_group" "main" {
  name       = "main-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id
  
  tags = {
    Name = "main-db-subnet-group"
  }
}

resource "aws_db_instance" "main" {
  identifier = "main-database"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  
  db_name  = "mydb"
  username = "admin"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  multi_az               = true
  publicly_accessible    = false
  skip_final_snapshot    = false
  final_snapshot_identifier = "main-db-final-snapshot"
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  
  tags = {
    Name = "main-database"
  }
}`}
              language="hcl"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Provisioners */}
      <section id="provisioners" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                8. Provisioners: Configuration Management
              </Heading>
              <Text className={styles.sectionDescription}>
                Use provisioners to execute scripts on local or remote machines during resource creation or destruction.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Local Provisioner: Execute on Terraform host
resource "null_resource" "example" {
  triggers = {
    always_run = timestamp()
  }
  
  provisioner "local-exec" {
    command = "echo 'Resource created at \$(date)'"
  }
}

# ✅ Remote Provisioner: Execute on remote resource
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  key_name = aws_key_pair.main.key_name
  
  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    private_key = file("~/.ssh/id_rsa")
    timeout     = "2m"
  }
  
  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install -y nginx",
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx"
    ]
  }
  
  provisioner "file" {
    source      = "config/nginx.conf"
    destination = "/tmp/nginx.conf"
    
    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ec2-user"
      private_key = file("~/.ssh/id_rsa")
    }
  }
  
  provisioner "remote-exec" {
    inline = [
      "sudo mv /tmp/nginx.conf /etc/nginx/nginx.conf",
      "sudo systemctl restart nginx"
    ]
  }
}

# ✅ File Provisioner: Copy files to remote resource
resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file("~/.ssh/id_rsa")
    host        = self.public_ip
  }
  
  provisioner "file" {
    source      = "app.tar.gz"
    destination = "/tmp/app.tar.gz"
  }
  
  provisioner "remote-exec" {
    inline = [
      "cd /tmp",
      "tar -xzf app.tar.gz",
      "sudo cp -r app/* /var/www/html/",
      "sudo chown -R apache:apache /var/www/html"
    ]
  }
}

# ✅ Self-Referencing Provisioner (destroy-time)
resource "aws_instance" "example" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Instance \${self.id} is being destroyed'"
  }
}

# ✅ Null Resource with Multiple Provisioners
resource "null_resource" "setup" {
  triggers = {
    instance_id = aws_instance.web.id
  }
  
  provisioner "local-exec" {
    command = <<-EOT
      echo "Instance created: \${aws_instance.web.id}"
      echo "Public IP: \${aws_instance.web.public_ip}"
    EOT
  }
  
  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      host        = aws_instance.web.public_ip
      user        = "ec2-user"
      private_key = file("~/.ssh/id_rsa")
    }
    
    script = "scripts/setup.sh"
  }
}

# ✅ Best Practice: Use Data Sources Instead When Possible
# Instead of provisioners, use cloud-init or user_data
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y nginx
    
    # Create custom nginx config
    cat > /etc/nginx/conf.d/custom.conf <<NGINX
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
    }
    NGINX
    
    systemctl start nginx
    systemctl enable nginx
  EOF
}

# ✅ Failure Behavior
resource "aws_instance" "example" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  provisioner "remote-exec" {
    on_failure = continue  # Continue even if provisioner fails
    
    inline = [
      "some-command-that-might-fail"
    ]
  }
  
  provisioner "local-exec" {
    when = create  # Only on create
    command = "echo 'Created'"
  }
  
  provisioner "local-exec" {
    when = destroy  # Only on destroy
    command = "echo 'Destroying'"
  }
}`}
              language="hcl"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Advanced Features */}
      <section id="advanced-features" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                9. Advanced Features: Functions, Locals, and Lifecycle
              </Heading>
              <Text className={styles.sectionDescription}>
                Master advanced Terraform features: built-in functions, local values, lifecycle rules, and conditional resources.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Local Values: Intermediate Computations
locals {
  # Common tags
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    CreatedAt   = timestamp()
  }
  
  # Computed values
  instance_name = "\${var.project_name}-\${var.environment}-web"
  
  # Conditional values
  instance_type = var.environment == "production" ? "t3.medium" : "t3.micro"
  
  # Merged maps
  instance_tags = merge(
    local.common_tags,
    {
      Name = local.instance_name
      Type = "web-server"
    }
  )
  
  # Lists and maps
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 3)
  
  # Complex calculations
  subnet_cidrs = [
    for i in range(3) : cidrsubnet(var.vpc_cidr, 8, i)
  ]
}

# Use locals in resources
resource "aws_instance" "web" {
  instance_type = local.instance_type
  tags          = local.instance_tags
}

# ✅ Built-in Functions
locals {
  # String functions
  instance_name = upper("web-server")
  formatted_name = format("%s-%s", var.project, var.env)
  
  # List functions
  subnets = concat(aws_subnet.public[*].id, aws_subnet.private[*].id)
  first_subnet = element(aws_subnet.public[*].id, 0)
  
  # Map functions
  all_tags = merge(var.default_tags, var.custom_tags)
  
  # Numeric functions
  instance_count = max(1, var.desired_count)
  
  # Type conversion
  port_number = tonumber(var.port_string)
  
  # Conditional
  enable_feature = var.environment == "production" ? true : false
  
  # Lookup
  ami_id = lookup(var.ami_map, var.region, var.default_ami)
  
  # Split and Join
  ip_parts = split(".", aws_instance.web.private_ip)
  ip_string = join(".", local.ip_parts)
  
  # File operations
  user_data_content = file("\${path.module}/scripts/user_data.sh")
  config_json = jsonencode({
    database = aws_db_instance.main.endpoint
    cache    = aws_elasticache_cluster.main.cache_nodes[0].address
  })
  
  # Template functions
  user_data_rendered = templatefile("\${path.module}/templates/user_data.tpl", {
    db_host = aws_db_instance.main.address
    db_name = aws_db_instance.main.db_name
  })
}

# ✅ For Expressions
# For Lists
locals {
  instance_names = [
    for i in range(3) : "web-server-\${i + 1}"
  ]
  
  # Transform list
  subnet_cidrs = [
    for subnet in var.subnets : subnet.cidr
  ]
  
  # Filter and transform
  public_subnets = [
    for subnet in aws_subnet.main : subnet.id
    if subnet.map_public_ip_on_launch == true
  ]
}

# For Maps
locals {
  # Transform map values
  uppercase_tags = {
    for k, v in var.tags : k => upper(v)
  }
  
  # Filter map
  production_tags = {
    for k, v in var.tags : k => v
    if var.environment == "production"
  }
}

# ✅ Lifecycle Rules
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  lifecycle {
    # Prevent accidental deletion
    prevent_destroy = var.environment == "production"
    
    # Ignore changes to specific attributes
    ignore_changes = [
      ami,
      user_data
    ]
    
    # Replace resource when these change
    replace_triggered_by = [
      aws_launch_template.web.latest_version
    ]
    
    # Create before destroy (zero downtime)
    create_before_destroy = true
  }
}

# ✅ Conditional Resources
resource "aws_instance" "web" {
  count = var.enable_web_server ? 1 : 0
  
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
}

resource "aws_db_instance" "main" {
  # Create only if not using external database
  count = var.use_external_db ? 0 : 1
  
  identifier = "main-database"
  # ... other configuration
}

# ✅ Data Source with Dynamic Filters
data "aws_instances" "web" {
  instance_tags = {
    Type = "web"
  }
  
  filter {
    name   = "instance-state-name"
    values = ["running"]
  }
}

# ✅ Dynamic Blocks
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Security group with dynamic rules"
  vpc_id      = aws_vpc.main.id
  
  # Dynamic ingress blocks
  dynamic "ingress" {
    for_each = var.allowed_ports
    content {
      description = "Port \${ingress.value.port}"
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
  
  # Dynamic egress block
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Variables for dynamic blocks
variable "allowed_ports" {
  description = "List of allowed ports"
  type = list(object({
    port        = number
    protocol    = string
    cidr_blocks = list(string)
  }))
  default = [
    {
      port        = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      port        = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}

# ✅ Depends On (Explicit Dependencies)
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  
  depends_on = [
    aws_security_group.web,
    aws_db_instance.main
  ]
}

# ✅ Output Dependencies
output "web_url" {
  value = "http://\${aws_instance.web.public_ip}"
  
  depends_on = [
    aws_instance.web,
    aws_security_group.web
  ]
}`}
              language="hcl"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                10. Best Practices & Production Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Learn production-ready patterns, security best practices, and how to structure Terraform code for scale.
              </Text>
            </div>

            <CodeComparison
              language="hcl"
              wrong={`# ❌ BAD: Monolithic file, hard-coded values, no structure
# main.tf (1000+ lines)
provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  # ... 50 resources in one file
}

# Problems:
# - Hard to navigate
# - Hard to test
# - Hard to reuse
# - No separation of concerns
# - Hard-coded values everywhere
# - No version control strategy
# - Secrets in code`}
              good={`# ✅ GOOD: Organized, modular, secure structure
# Directory structure:
# terraform/
#   ├── environments/
#   │   ├── dev/
#   │   │   ├── main.tf
#   │   │   ├── terraform.tfvars
#   │   │   └── backend.tf
#   │   ├── staging/
#   │   └── production/
#   ├── modules/
#   │   ├── vpc/
#   │   ├── ec2/
#   │   └── rds/
#   └── scripts/

# ✅ Version Constraints
terraform {
  required_version = ">= 1.0, < 2.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # Allows 5.x but not 6.0
    }
  }
}

# ✅ Remote Backend (Production)
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
    
    # Workspace-specific keys
    # key = "\${terraform.workspace}/terraform.tfstate"
  }
}

# ✅ Variable Validation
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  
  validation {
    condition = contains([
      "t3.micro", "t3.small", "t3.medium", 
      "t3.large", "t3.xlarge"
    ], var.instance_type)
    error_message = "Instance type must be a valid t3 instance."
  }
}

# ✅ Secrets Management (Never commit secrets)
# Use AWS Secrets Manager
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "production/database/password"
}

locals {
  db_password = jsondecode(
    data.aws_secretsmanager_secret_version.db_password.secret_string
  )["password"]
}

# Or use environment variables
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
  # Set via: TF_VAR_db_password=secret terraform apply
}

# ✅ Tagging Strategy
locals {
  common_tags = {
    Environment   = var.environment
    Project       = var.project_name
    ManagedBy     = "Terraform"
    TerraformRepo = "github.com/company/infrastructure"
    CostCenter    = var.cost_center
    Owner         = var.team_name
  }
}

# ✅ Use Data Sources Instead of Hard-coding
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# ✅ Outputs for Integration
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "database_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

# ✅ Module Organization
module "vpc" {
  source = "../../modules/vpc"
  
  name               = var.project_name
  cidr               = var.vpc_cidr
  availability_zones = var.availability_zones
}

module "web_app" {
  source = "../../modules/web-app"
  
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  instance_type     = var.instance_type
  instance_count    = var.instance_count
}

# ✅ Use Workspaces for Environments
terraform {
  backend "s3" {
    key = "\${terraform.workspace}/terraform.tfstate"
  }
}

# ✅ CI/CD Integration
# .github/workflows/terraform.yml
# - terraform fmt -check
# - terraform validate
# - terraform plan
# - terraform apply (on merge to main)

# ✅ State Locking (Critical for Team)
# Always use DynamoDB for state locking
resource "aws_dynamodb_table" "terraform_state_lock" {
  name           = "terraform-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
  
  tags = {
    Name = "Terraform State Lock"
  }
}

# ✅ Pre/Post Conditions (Terraform 1.5+)
variable "instance_count" {
  type = number
  
  validation {
    condition     = var.instance_count > 0
    error_message = "Instance count must be greater than 0."
  }
}

resource "aws_instance" "web" {
  count = var.instance_count
  # ...
  
  lifecycle {
    precondition {
      condition     = var.instance_count <= 10
      error_message = "Cannot create more than 10 instances."
    }
    
    postcondition {
      condition     = self.private_ip != null
      error_message = "Instance must have a private IP address."
    }
  }
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* Importing Existing Infrastructure */}
      <section id="import" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                11. Importing Existing Infrastructure
              </Heading>
              <Text className={styles.sectionDescription}>
                Learn how to import existing cloud resources into Terraform state to manage them with Infrastructure as Code.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Import Process
# Step 1: Write resource configuration
resource "aws_instance" "existing" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  
  tags = {
    Name = "existing-instance"
  }
}

# Step 2: Generate import command
# terraform import aws_instance.existing i-1234567890abcdef0

# Step 3: Run import
terraform import aws_instance.existing i-1234567890abcdef0

# Step 4: Verify with plan (should show no changes)
terraform plan

# ✅ Import Multiple Resources
# Import VPC
terraform import aws_vpc.main vpc-12345678

# Import Subnets
terraform import aws_subnet.public[0] subnet-12345678
terraform import aws_subnet.public[1] subnet-87654321
terraform import aws_subnet.private[0] subnet-abcdef12

# Import Security Group
terraform import aws_security_group.web sg-12345678

# ✅ Import with Complex IDs
# Import RDS Instance
terraform import aws_db_instance.main my-database-instance

# Import S3 Bucket
terraform import aws_s3_bucket.my_bucket my-bucket-name

# Import IAM Role
terraform import aws_iam_role.example_role arn:aws:iam::123456789012:role/example-role

# ✅ Import Script (Automation)
#!/bin/bash
# import-resources.sh

INSTANCE_ID="i-1234567890abcdef0"
terraform import aws_instance.existing $INSTANCE_ID

SUBNET_ID="subnet-12345678"
terraform import aws_subnet.public[0] $SUBNET_ID

# ✅ Import and Refactor
# After importing, you can refactor:
# 1. Add variables
# 2. Create modules
# 3. Add outputs
# 4. Improve tagging
# 5. Add validation

# ✅ Using terraform import block (Terraform 1.5+)
# Automates import process
import {
  to = aws_instance.existing
  id = "i-1234567890abcdef0"
}

resource "aws_instance" "existing" {
  # Configuration matches existing resource
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}

# Run: terraform plan -generate-config-out=generated.tf
# This generates the configuration automatically

# ✅ Import Modules
# Import resources into module
terraform import module.vpc.aws_vpc.main vpc-12345678

# ✅ Common Import Scenarios
# 1. Migrating from manual infrastructure
# 2. Migrating from CloudFormation
# 3. Migrating from other IaC tools
# 4. Taking over existing projects
# 5. Disaster recovery (recreating state)`}
              language="bash"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                12. Troubleshooting & Common Issues
              </Heading>
              <Text className={styles.sectionDescription}>
                Debug common Terraform issues, understand error messages, and learn troubleshooting techniques.
              </Text>
            </div>

            <CodeEditor
              code={`# ✅ Common Commands for Debugging

# Enable verbose logging
export TF_LOG=DEBUG
terraform plan

# Log levels: TRACE, DEBUG, INFO, WARN, ERROR

# Save log to file
export TF_LOG=DEBUG
export TF_LOG_PATH=./terraform.log
terraform apply

# ✅ Common Errors and Solutions

# Error: Provider configuration not present
# Solution: Run terraform init

# Error: State locking
# Solution: Check if another process is running
terraform force-unlock <LOCK_ID>

# Error: Backend configuration changed
# Solution: Re-initialize backend
terraform init -migrate-state

# Error: Resource already exists
# Solution: Import existing resource
terraform import <resource_type>.<name> <resource_id>

# Error: Invalid configuration
# Solution: Validate syntax
terraform validate

# ✅ Debugging State Issues

# List all resources in state
terraform state list

# Inspect specific resource
terraform state show aws_instance.web

# Remove resource from state (without destroying)
terraform state rm aws_instance.web

# Move resource in state
terraform state mv aws_instance.old aws_instance.new

# Refresh state (reconcile with real infrastructure)
terraform refresh

# ✅ Troubleshooting Modules

# Update module source
terraform init -upgrade

# Verify module path
terraform get

# Check module requirements
terraform version

# ✅ Debugging Variable Issues

# Show all variable values
terraform console
> var.instance_type
> var.tags

# Check variable files
terraform plan -var-file="custom.tfvars"

# Test variable validation
terraform validate -var="instance_type=invalid"

# ✅ Common Patterns for Debugging

# Use terraform console for testing
terraform console
> length(aws_subnet.public)
> aws_instance.web[*].id
> cidrsubnet("10.0.0.0/16", 8, 0)

# Output debugging information
output "debug" {
  value = {
    vpc_id        = aws_vpc.main.id
    subnet_count  = length(aws_subnet.public)
    instance_ips  = aws_instance.web[*].private_ip
  }
}

# ✅ Handling State Drift

# Detect drift
terraform plan -detailed-exitcode

# Refresh state
terraform refresh

# Update resource in place
terraform apply -refresh-only

# ✅ Working with Large States

# Split large state files
# Use modules with separate state
# Use terraform state pull/push for operations

# Backup state before operations
terraform state pull > backup.tfstate

# ✅ Performance Optimization

# Use -parallelism flag
terraform apply -parallelism=20

# Use -refresh=false for faster plans
terraform plan -refresh=false

# Use -target for specific resources
terraform apply -target=aws_instance.web

# ✅ Validation Best Practices

# Always validate before applying
terraform validate && terraform plan

# Use pre-commit hooks
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    hooks:
      - id: terraform_fmt
      - id: terraform_validate`}
              language="bash"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}
