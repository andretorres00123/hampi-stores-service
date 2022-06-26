resource "aws_kms_key" "hampi_kms_key" {
  description             = "This key is used for Hampi"
  enable_key_rotation     = true
  deletion_window_in_days = 7
  policy                  = data.aws_iam_policy_document.hampi_kms_policy_trusted_role.json

  tags = merge(local.common_aws_tags, {
    Name        = "Hampi KMS KEY"
    Description = "Enable encryption on multileresources for Hampi"
  })
}

data "aws_iam_policy_document" "hampi_kms_policy_trusted_role" {
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

