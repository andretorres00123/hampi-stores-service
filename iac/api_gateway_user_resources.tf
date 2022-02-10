### Resources

resource "aws_api_gateway_resource" "sign_up_resource" {
  rest_api_id = aws_api_gateway_resource.v1_resource.rest_api_id
  parent_id   = aws_api_gateway_resource.v1_resource.id
  path_part   = "signup"
}

### Methods

resource "aws_api_gateway_method" "sign_up_post_method" {
  rest_api_id      = aws_api_gateway_resource.sign_up_resource.rest_api_id
  resource_id      = aws_api_gateway_resource.sign_up_resource.id
  http_method      = "POST"
  authorization    = "NONE"
  api_key_required = true
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
