resource "aws_api_gateway_usage_plan" "auth_usage_plan" {
  name         = "hampi-auth-usage-plan-${local.namespace}"
  description  = "Auth Usage Plan"
  product_code = "AUTH"

  api_stages {
    api_id = aws_api_gateway_rest_api.stores_api_gateway.id
    stage  = aws_api_gateway_stage.stores_api_stage.stage_name
  }

  quota_settings {
    limit  = 1000000000
    offset = 0
    period = "DAY"
  }

  throttle_settings {
    burst_limit = 100
    rate_limit  = 10000
  }

  tags = merge(local.common_aws_tags, {
    Name        = "Hampi Auth Usage Plan"
    Description = "Hampi Auth Usage Plan"
  })
}

resource "aws_api_gateway_api_key" "auth_api_key" {
  name = "sfu-auth-api-key-${local.namespace}"
  tags = merge(local.common_aws_tags, {
    Name        = "Hampi Auth Key"
    Description = "Hampi Auth Key"
  })
}

resource "aws_api_gateway_usage_plan_key" "auth_key_plan" {
  key_id        = aws_api_gateway_api_key.auth_api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.auth_usage_plan.id
}
