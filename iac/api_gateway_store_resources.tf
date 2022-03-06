### Resources

resource "aws_api_gateway_resource" "stores_resource" {
  rest_api_id = aws_api_gateway_resource.v1_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.v1_resource.id
  path_part   = "stores"
}

resource "aws_api_gateway_resource" "workspace_resource" {
  rest_api_id = aws_api_gateway_resource.stores_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.stores_resource.id
  path_part   = "{workspace}"
}

### Methods

resource "aws_api_gateway_method" "stores_post_method" {
  rest_api_id   = aws_api_gateway_resource.stores_resource.rest_api_id
  resource_id   = aws_api_gateway_resource.stores_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "store_get_method" {
  rest_api_id   = aws_api_gateway_resource.workspace_resource.rest_api_id
  resource_id   = aws_api_gateway_resource.workspace_resource.id
  http_method   = "GET"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.workspace" = true
  }
}

### Integrations

resource "aws_api_gateway_integration" "stores_post_integration" {
  http_method             = aws_api_gateway_method.stores_post_method.http_method
  resource_id             = aws_api_gateway_resource.stores_resource.id
  rest_api_id             = aws_api_gateway_rest_api.stores_api_gateway.id
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.stores_lambda.lambda_function_invoke_arn
}

resource "aws_api_gateway_integration" "store_get_integration" {
  http_method             = aws_api_gateway_method.store_get_method.http_method
  resource_id             = aws_api_gateway_resource.workspace_resource.id
  rest_api_id             = aws_api_gateway_rest_api.stores_api_gateway.id
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.stores_lambda.lambda_function_invoke_arn
}
