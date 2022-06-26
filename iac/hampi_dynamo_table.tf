resource "aws_dynamodb_table" "hampi_table" {
  hash_key     = "PK"
  range_key    = "SK"
  name         = "hampi-main-${local.namespace}"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.hampi_kms_key.arn
  }

  tags = merge(local.common_aws_tags, {
    Name        = "HAMPI Main DynamoDB Table"
    Description = "DynamoDB table for Hampi entities"
  })
}
