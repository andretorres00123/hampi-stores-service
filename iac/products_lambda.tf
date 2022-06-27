locals {
  products_lambda_policy = templatefile("./policies/products_lambda_policy.json", {
    HAMPI_TABLE_ARN = aws_dynamodb_table.hampi_table.arn
  })

  products_environment_variables = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = var.AWS_NODEJS_CONNECTION_REUSE_ENABLED
    NODE_ENV                            = "production"
    HAMPI_APP_TABLE                     = aws_dynamodb_table.hampi_table.name
    CORS_ALLOW_ORIGIN                   = var.CORS_ALLOW_ORIGIN
  }

  products_lambda_name = "hampi_products_lambda"
}

module "products_lambda" {
  source           = "./modules/lambda"
  lambda_name      = local.products_lambda_name
  namespace        = local.namespace
  common_aws_tags  = local.common_aws_tags
  archive_file     = "../bundles/products.zip"
  lambda_handler   = "functions/products/index.handler"
  aws_region       = local.region
  environment_vars = local.products_environment_variables
  memory_size      = var.LAMBDA_DEFAULT_MEMORY_SIZE
}

resource "aws_iam_role_policy" "products_lambda_function_role_policy" {
  name   = "hampi_products_${local.namespace}_lambda_function_policy"
  role   = module.products_lambda.iam_role_name
  policy = local.products_lambda_policy
}

# API Gateway lambda invoke permission
resource "aws_lambda_permission" "products_resource" {
  statement_id  = "${module.products_lambda.lambda_function_name}-${local.namespace}-lambda-permission"
  action        = "lambda:InvokeFunction"
  function_name = module.products_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.stores_api_gateway.execution_arn}/*/*/*"
}
