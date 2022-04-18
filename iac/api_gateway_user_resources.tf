### Resources

resource "aws_api_gateway_resource" "sign_up_resource" {
  rest_api_id = aws_api_gateway_resource.v1_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.v1_resource.id
  path_part   = "signup"
}

resource "aws_api_gateway_resource" "users_resource" {
  rest_api_id = aws_api_gateway_resource.v1_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.v1_resource.id
  path_part   = "users"
}

resource "aws_api_gateway_resource" "update_profile_resource" {
  rest_api_id = aws_api_gateway_resource.users_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.users_resource.id
  path_part   = "updateProfile"
}

### Methods

resource "aws_api_gateway_method" "sign_up_post_method" {
  rest_api_id      = aws_api_gateway_resource.sign_up_resource.rest_api_id
  resource_id      = aws_api_gateway_resource.sign_up_resource.id
  http_method      = "POST"
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_method" "users_put_method" {
  rest_api_id   = aws_api_gateway_resource.update_profile_resource.rest_api_id
  resource_id   = aws_api_gateway_resource.update_profile_resource.id
  http_method   = "PUT"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.hampi_stores_rest_api_authorizer.id
  request_parameters = {
    "method.request.header.Authorization" = true
  }
}

### Integrations

resource "aws_api_gateway_integration" "sign_up_integration" {
  http_method             = aws_api_gateway_method.sign_up_post_method.http_method
  resource_id             = aws_api_gateway_resource.sign_up_resource.id
  rest_api_id             = aws_api_gateway_rest_api.stores_api_gateway.id
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.sign_up_lambda.lambda_function_invoke_arn
}

resource "aws_api_gateway_integration" "users_put_integration" {
  http_method             = aws_api_gateway_method.users_put_method.http_method
  resource_id             = aws_api_gateway_resource.update_profile_resource.id
  rest_api_id             = aws_api_gateway_rest_api.stores_api_gateway.id
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.users_lambda.lambda_function_invoke_arn
}

# CORS Config

module "update_profile_resource" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.stores_api_gateway.id
  api_resource_id = aws_api_gateway_resource.update_profile_resource.id
  allow_origin    = var.CORS_ALLOW_ORIGIN
  allow_headers   = local.allowed_cors_headers
}
