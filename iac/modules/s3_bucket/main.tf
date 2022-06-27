locals {
  bucket_name = "${var.bucket_name}-${var.namespace}"
}

resource "aws_kms_key" "this_encrypt_key" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(var.common_aws_tags, {
    Name        = "Hampi S3 Encryption Key"
    Description = "Allow Hampi to enable encryption on S3 bucket"
  })
}

resource "aws_s3_bucket" "this" {
  bucket        = local.bucket_name
  force_destroy = true

  tags = merge(var.common_aws_tags, {
    Name        = "Hampi ${local.bucket_name} bucket"
    Description = var.bucket_description
  })
}

resource "aws_s3_bucket_versioning" "this_versioning" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Disabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.bucket

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.this_encrypt_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.this.id
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "media_bucket_public_access_block" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
  ignore_public_acls      = true
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["XMLHttpRequest "]
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}
