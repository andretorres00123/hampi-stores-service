locals {
  lambda_name = "${var.lambda_name}_${var.namespace}"
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name = "/aws/lambda/${local.lambda_name}"

  tags = merge(var.common_aws_tags, {
    Name        = "${local.lambda_name} Lambda Log Group"
    Description = "Configuration for ${local.lambda_name} Lambda Log Group"
  })
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
    effect = "Allow"
  }
}

# Lambda Function
resource "aws_lambda_function" "lambda_function" {
  filename         = var.archive_file
  function_name    = local.lambda_name
  role             = aws_iam_role.lambda_function_role.arn
  handler          = var.lambda_handler
  runtime          = "nodejs12.x"
  publish          = true
  source_code_hash = filemd5(var.archive_file)
  memory_size      = var.memory_size
  timeout          = var.lambda_timeout

  tracing_config {
    mode = var.enable_tracing ? "Active" : "PassThrough"
  }

  tags = merge(var.common_aws_tags, {
    Name        = "${local.lambda_name} Lambda function"
    Description = "Lambda function for ${local.lambda_name}"
  })

  environment {
    variables = var.environment_vars
  }

  depends_on = [
    aws_cloudwatch_log_group.lambda_log_group,
    aws_iam_role.lambda_function_role
  ]
}

resource "aws_iam_role" "lambda_function_role" {
  name               = "${local.lambda_name}_lambda_function_role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = merge(var.common_aws_tags, {
    Name        = "IAM Role for ${local.lambda_name} Lambda function"
    Description = "Allow service to assume IAM role for the ${local.lambda_name} Lambda function"
  })
}

resource "aws_iam_role_policy_attachment" "lambda_function_xray" {
  role       = aws_iam_role.lambda_function_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess"
}

# AWSLambdaBasicExecutionRole for logging
resource "aws_iam_role_policy_attachment" "lambda_function_role_policy_attch" {
  role       = aws_iam_role.lambda_function_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_provisioned_concurrency_config" "provisioned_concurrency" {
  count                             = var.provisioned_concurrent_executions == 1 ? 0 : 1
  function_name                     = aws_lambda_function.lambda_function.function_name
  provisioned_concurrent_executions = var.provisioned_concurrent_executions
  qualifier                         = aws_lambda_function.lambda_function.version
}
