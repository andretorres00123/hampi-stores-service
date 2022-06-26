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
    kms_key_arn = aws_kms_key.hampi_kms_key.arn
  }

  tags = merge(local.common_aws_tags, {
    Name        = "HAMPI Uploads DynamoDB Table"
    Description = "DynamoDB table for Hampi uploads"
  })
}
