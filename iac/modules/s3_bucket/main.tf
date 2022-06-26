locals {
  bucket_name = "${var.bucket_name}-${var.namespace}"
}

resource "aws_kms_key" "this_encrypt_key" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 7
  enable_key_rotation     = true
  policy                  = data.aws_iam_policy_document.this_kms_policy_trusted_role.json

  tags = merge(var.common_aws_tags, {
    Name        = "Hampi S3 Encryption Key"
    Description = "Allow Hampi to enable encryption on S3 bucket"
  })
}

data "aws_iam_policy_document" "this_kms_policy_trusted_role" {
  # Set this account as administrator of the key to avoid "The new key policy will not allow you to update the key policy in the future"
  statement {
    effect    = "Allow"
    resources = ["*"]
    actions   = ["kms:*"]

    principals {
      type        = "AWS"
      identifiers = [var.account_arn]
    }
  }
}

resource "aws_s3_bucket" "this" {
  bucket        = local.bucket_name
  acl           = "private"
  force_destroy = true

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = aws_kms_key.this_encrypt_key.arn
        sse_algorithm     = "aws:kms"
      }
    }
  }

  cors_rule {
    allowed_methods = ["POST", "PUT"]
    allowed_headers = ["*"]
    allowed_origins = var.allowed_origins
  }

  versioning {
    enabled = var.enable_versioning
  }

  tags = merge(var.common_aws_tags, {
    Name        = "Hampi ${local.bucket_name} bucket"
    Description = var.bucket_description
  })
  #checkov:skip=CKV2_AWS_6:public access block is configured correctly
  #checkov:skip=CKV_AWS_144:no need for cross-region replication
}

resource "aws_s3_bucket_public_access_block" "media_bucket_public_access_block" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
  ignore_public_acls      = true
}
