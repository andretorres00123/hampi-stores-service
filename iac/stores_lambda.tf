locals {
  stores_lambda_policy = templatefile("./policies/stores_lambda_policy.json", {
    HAMPI_TABLE_ARN = aws_dynamodb_table.hampi_table.arn
  })

  stores_environment_variables = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = var.AWS_NODEJS_CONNECTION_REUSE_ENABLED
    NODE_ENV                            = "production"
    HAMPI_APP_TABLE                     = aws_dynamodb_table.hampi_table.name
    CORS_ALLOW_ORIGIN                   = var.CORS_ALLOW_ORIGIN
  }

  stores_lambda_name = "hampi_stores_lambda"
}

module "stores_lambda" {
  source           = "./modules/lambda"
  lambda_name      = local.stores_lambda_name
  namespace        = local.namespace
  common_aws_tags  = local.common_aws_tags
  archive_file     = "../bundles/stores.zip"
  lambda_handler   = "functions/stores/index.handler"
  aws_region       = local.region
  environment_vars = local.stores_environment_variables
  memory_size      = var.LAMBDA_DEFAULT_MEMORY_SIZE
}

resource "aws_iam_role_policy" "stores_lambda_function_role_policy" {
  name   = "hampi_stores_${local.namespace}_lambda_function_policy"
  role   = module.stores_lambda.iam_role_name
  policy = local.stores_lambda_policy
}

# API Gateway lambda invoke permission
resource "aws_lambda_permission" "stores_resource" {
  statement_id  = "${module.stores_lambda.lambda_function_name}-${local.namespace}-lambda-permission"
  action        = "lambda:InvokeFunction"
  function_name = module.stores_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.stores_api_gateway.execution_arn}/*/*/*"
}
