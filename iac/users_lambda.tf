locals {
  users_lambda_policy = templatefile("./policies/users_lambda_policy.json", {
    HAMPI_TABLE_ARN = aws_dynamodb_table.hampi_table.arn
  })

  users_lambda_environment_variables = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = var.AWS_NODEJS_CONNECTION_REUSE_ENABLED
    NODE_ENV                            = "production"
    HAMPI_APP_TABLE                     = aws_dynamodb_table.hampi_table.name
    CORS_ALLOW_ORIGIN                   = var.CORS_ALLOW_ORIGIN
  }

  users_lambda_name = "users_lambda"
}

module "users_lambda" {
  source           = "./modules/lambda"
  lambda_name      = local.users_lambda_name
  namespace        = local.namespace
  common_aws_tags  = local.common_aws_tags
  archive_file     = "../bundles/users.zip"
  lambda_handler   = "functions/users/index.handler"
  aws_region       = local.region
  environment_vars = local.users_lambda_environment_variables
  memory_size      = var.LAMBDA_DEFAULT_MEMORY_SIZE
}

resource "aws_iam_role_policy" "users_lambda_function_role_policy" {
  name   = "hampi_users_${local.namespace}_lambda_function_policy"
  role   = module.users_lambda.iam_role_name
  policy = local.users_lambda_policy
}

# API Gateway lambda invoke permission
resource "aws_lambda_permission" "users_resource" {
  statement_id  = "${module.users_lambda.lambda_function_name}-${local.namespace}-lambda-permission"
  action        = "lambda:InvokeFunction"
  function_name = module.users_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.stores_api_gateway.execution_arn}/*/*/*"
}
