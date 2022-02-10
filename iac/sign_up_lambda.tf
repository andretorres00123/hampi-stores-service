locals {
  sign_up_environment_variables = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = var.AWS_NODEJS_CONNECTION_REUSE_ENABLED
    NODE_ENV                            = "production"
  }

  sign_up_lambda_name = "hampi_sign_up_lambda"
}

module "sign_up_lambda" {
  source           = "./modules/lambda"
  lambda_name      = local.sign_up_lambda_name
  namespace        = local.namespace
  common_aws_tags  = local.common_aws_tags
  archive_file     = "../bundles/signUp.zip"
  lambda_handler   = "functions/signUp/index.handler"
  aws_region       = local.region
  environment_vars = local.sign_up_environment_variables
  memory_size      = var.LAMBDA_DEFAULT_MEMORY_SIZE
}

# API Gateway lambda invoke permission
resource "aws_lambda_permission" "sign_up_resource" {
  statement_id  = "${module.sign_up_lambda.lambda_function_name}-${local.namespace}-lambda-permission"
  action        = "lambda:InvokeFunction"
  function_name = module.sign_up_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.stores_api_gateway.execution_arn}/*/*/*"
}
