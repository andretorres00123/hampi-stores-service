terraform {
  backend "s3" {
    bucket         = "hampi-terraformbackend"
    key            = "stores-api/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "hampi-terraform-lock"
  }
}

provider "aws" {
  region      = "us-east-1"
  max_retries = 10
  ignore_tags {
    keys = ["LastCommitter", "Version"]
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

locals {
  account_arn  = data.aws_caller_identity.current.arn
  environment  = terraform.workspace
  namespace    = local.environment
  account_id   = data.aws_caller_identity.current.account_id
  region       = data.aws_region.current.id
  service_name = "hampi-events-api"

  common_aws_tags = {
    Environment          = terraform.workspace
    Owner                = "HAMPI"
    Project              = "API: Stores Rest API"
    Organization         = "Hampi"
    LoggingPlatform      = "CLOUDWATCH"
    GeographicDeployment = "US"
  }
}
