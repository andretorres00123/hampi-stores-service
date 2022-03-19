locals {
  authorizer_environment_variables = {
    NODE_ENV = "production"
  }

  authorizer_lambda_name = "hampi_authorizer_lambda"
}

module "authorizer_lambda" {
  source           = "./modules/lambda"
  lambda_name      = local.authorizer_lambda_name
  namespace        = local.namespace
  common_aws_tags  = local.common_aws_tags
  archive_file     = "../bundles/authorizer.zip"
  lambda_handler   = "functions/authorizer/index.handler"
  aws_region       = local.region
  environment_vars = local.authorizer_environment_variables
  memory_size      = var.LAMBDA_DEFAULT_MEMORY_SIZE
}

# Authorizer roles and definition
resource "aws_iam_role" "authorizer_invocation_role" {
  name               = "${local.namespace}_hampi_auth_invocation"
  path               = "/"
  assume_role_policy = file("./policies/authorizer_role.json")
  tags = merge(local.common_aws_tags, {
    Name        = "Authorizer Role"
    Description = "IAM role for Hampi REST API custom authorizer lambda."
  })
}

resource "aws_iam_role_policy" "authorizer_invocation_policy" {
  name = "default"
  role = aws_iam_role.authorizer_invocation_role.id
  policy = templatefile("./policies/authorizer_iam_policy.json", {
    AUTHORIZER_ARN = module.authorizer_lambda.lambda_function_arn
  })
}

resource "aws_api_gateway_authorizer" "hampi_stores_rest_api_authorizer" {
  name                             = "hampi_rest_api_jwt_authorizer_${local.namespace}"
  rest_api_id                      = aws_api_gateway_rest_api.stores_api_gateway.id
  authorizer_uri                   = module.authorizer_lambda.lambda_function_invoke_arn
  authorizer_credentials           = aws_iam_role.authorizer_invocation_role.arn
  authorizer_result_ttl_in_seconds = 0
  identity_validation_expression   = "^(Bearer .+)"
}
