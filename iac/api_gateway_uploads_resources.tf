### Resources

resource "aws_api_gateway_resource" "uploads_resource" {
  rest_api_id = aws_api_gateway_resource.v1_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.v1_resource.id
  path_part   = "uploads"
}

resource "aws_api_gateway_resource" "signed_url_resource" {
  rest_api_id = aws_api_gateway_resource.uploads_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.uploads_resource.id
  path_part   = "getSignedUrl"
}

### Methods

resource "aws_api_gateway_method" "uploads_post_method" {
  rest_api_id   = aws_api_gateway_resource.uploads_resource.rest_api_id
  resource_id   = aws_api_gateway_resource.uploads_resource.id
  http_method   = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.hampi_stores_rest_api_authorizer.id
  request_parameters = {
    "method.request.header.Authorization" = true
  }
}

resource "aws_api_gateway_method" "signed_url_get_method" {
  rest_api_id   = aws_api_gateway_resource.signed_url_resource.rest_api_id
  resource_id   = aws_api_gateway_resource.signed_url_resource.id
  http_method   = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.hampi_stores_rest_api_authorizer.id
  request_parameters = {
    "method.request.header.Authorization" = true
  }
}

### Integrations

resource "aws_api_gateway_integration" "uploads_integration" {
  http_method             = aws_api_gateway_method.uploads_post_method.http_method
  resource_id             = aws_api_gateway_resource.uploads_resource.id
  rest_api_id             = aws_api_gateway_rest_api.stores_api_gateway.id
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.uploads_lambda.lambda_function_invoke_arn
}

resource "aws_api_gateway_integration" "signed_url_integration" {
  http_method             = aws_api_gateway_method.signed_url_get_method.http_method
  resource_id             = aws_api_gateway_resource.signed_url_resource.id
  rest_api_id             = aws_api_gateway_rest_api.stores_api_gateway.id
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.uploads_lambda.lambda_function_invoke_arn
}


# CORS CONFIG

module "cors_configuration_uploads_resource" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.stores_api_gateway.id
  api_resource_id = aws_api_gateway_resource.uploads_resource.id
  allow_origin    = var.CORS_ALLOW_ORIGIN
  allow_headers   = local.allowed_cors_headers
}

module "cors_configuration_signed_url_resource" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.stores_api_gateway.id
  api_resource_id = aws_api_gateway_resource.signed_url_resource.id
  allow_origin    = var.CORS_ALLOW_ORIGIN
  allow_headers   = local.allowed_cors_headers
}
