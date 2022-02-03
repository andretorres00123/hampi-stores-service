locals {
  api_gateway_name        = "hampi_stores_service_${local.namespace}"
  api_gateway_description = "REST API to handle Hampi operations"
}

resource "aws_api_gateway_rest_api" "stores_api_gateway" {
  name               = local.api_gateway_name
  description        = local.api_gateway_description
  binary_media_types = ["*/*"]

  tags = merge(local.common_aws_tags, {
    Name        = local.api_gateway_name
    Description = local.api_gateway_description
  })
}

resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = aws_api_gateway_rest_api.stores_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.stores_api_gateway.root_resource_id
  path_part   = "api"
}

resource "aws_api_gateway_resource" "v1_resource" {
  rest_api_id = aws_api_gateway_rest_api.stores_api_gateway.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "v1"
}

resource "aws_api_gateway_deployment" "stores_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.stores_api_gateway.id

  #   depends_on = [
  #     aws_api_gateway_integration.get_policies_info_integration,
  #     aws_api_gateway_integration.get_policy_id_card_stream_integration
  #   ]

  #   triggers = {
  #     # NOTE: The configuration below will satisfy ordering considerations,
  #     #       but not pick up all future REST API changes. More advanced patterns
  #     #       are possible, such as using the filesha1() function against the
  #     #       Terraform configuration file(s) or removing the .id references to
  #     #       calculate a hash against whole resources. Be aware that using whole
  #     #       resources will show a difference after the initial implementation.
  #     #       It will stabilize to only change when resources change afterwards.
  #     redeployment = sha1(jsonencode([
  #       aws_api_gateway_method.get_policies_info_get_method,
  #       aws_api_gateway_method.get_policy_id_card_stream_get_method,
  #       aws_api_gateway_integration.get_policies_info_integration,
  #       aws_api_gateway_integration.get_policy_id_card_stream_integration
  #     ]))
  #   }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "stores_api_stage" {
  deployment_id        = aws_api_gateway_deployment.stores_api_deployment.id
  rest_api_id          = aws_api_gateway_rest_api.stores_api_gateway.id
  stage_name           = local.namespace
  xray_tracing_enabled = true
}

resource "aws_api_gateway_method_settings" "hampi_rest_api_stage_settings" {
  depends_on = [
    aws_api_gateway_deployment.stores_api_deployment,
    aws_api_gateway_stage.stores_api_stage
  ]
  rest_api_id = aws_api_gateway_rest_api.stores_api_gateway.id
  stage_name  = local.namespace
  method_path = "*/*"
  settings {
    metrics_enabled    = true
    logging_level      = "ERROR"
    data_trace_enabled = true
  }
}
