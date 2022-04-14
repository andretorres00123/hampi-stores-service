locals {
  uploads_lambda_policy = templatefile("./policies/uploads_lambda_policy.json", {
    HAMPI_UPLOADS_TABLE_ARN = aws_dynamodb_table.uploads_table.arn
  })

  uploads_environment_variables = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = var.AWS_NODEJS_CONNECTION_REUSE_ENABLED
    NODE_ENV                            = "production"
  }
}

module "uploads_lambda" {
  source           = "./modules/lambda"
  lambda_name      = "hampi_uploads_lambda"
  namespace        = local.namespace
  common_aws_tags  = local.common_aws_tags
  archive_file     = "../bundles/uploads.zip"
  lambda_handler   = "functions/uploads/index.handler"
  aws_region       = local.region
  environment_vars = local.stores_environment_variables
  memory_size      = var.LAMBDA_DEFAULT_MEMORY_SIZE
}

resource "aws_iam_role_policy" "uploads_lambda_function_role_policy" {
  name   = "hampi_uploads_${local.namespace}_lambda_function_policy"
  role   = module.uploads_lambda.iam_role_name
  policy = local.stores_lambda_policy
}

# API Gateway lambda invoke permission
resource "aws_lambda_permission" "uploads_resource" {
  statement_id  = "${module.uploads_lambda.lambda_function_name}-${local.namespace}-lambda-permission"
  action        = "lambda:InvokeFunction"
  function_name = module.uploads_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.stores_api_gateway.execution_arn}/*/*/*"
}
