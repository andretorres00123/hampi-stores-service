resource "aws_kms_key" "uploads_table_kms_key" {
  description             = "This key is used to encrypt Uploads DynamoDB Table"
  enable_key_rotation     = true
  deletion_window_in_days = 7
  policy                  = data.aws_iam_policy_document.uploads_table_kms_policy_trusted_role.json

  tags = merge(local.common_aws_tags, {
    Name        = "Uploads KMS KEY"
    Description = "Enable encryption on Uploads DynamoDB Table"
  })
}

data "aws_iam_policy_document" "uploads_table_kms_policy_trusted_role" {
  # Set this account as administrator of the key to avoid "The new key policy will not allow you to update the key policy in the future"
  statement {
    effect    = "Allow"
    resources = ["*"]
    actions   = ["kms:*"]

    principals {
      type        = "AWS"
      identifiers = [local.account_arn]
    }
  }

  statement {
    actions = [
      "kms:Encrypt*",
      "kms:Decrypt*"
    ]
    effect    = "Allow"
    resources = ["*"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    condition {
      test     = "StringEquals"
      variable = "kms:CallerAccount"
      values   = [local.account_id]
    }

    condition {
      test     = "StringEquals"
      variable = "kms:ViaService"
      values   = ["dynamodb.${local.region}.amazonaws.com"]
    }
  }
}

resource "aws_dynamodb_table" "uploads_table" {
  hash_key     = "PK"
  name         = "hampi-uploads-${local.namespace}"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "isUploaded"
    type = "N"
  }

  global_secondary_index {
    name            = "uploaded_status"
    hash_key        = "isUploaded"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.uploads_table_kms_key.arn
  }

  tags = merge(local.common_aws_tags, {
    Name        = "HAMPI Uploads DynamoDB Table"
    Description = "DynamoDB table for Hampi uploads"
  })
}
