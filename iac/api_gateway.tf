locals {
  api_gateway_name        = "hampi_stores_service_${local.namespace}"
  api_gateway_description = "REST API to handle Hampi operations"
}

resource "aws_api_gateway_rest_api" "stores_api_gateway" {
  name        = local.api_gateway_name
  description = local.api_gateway_description

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

  depends_on = [
    aws_api_gateway_integration.sign_up_integration,
    aws_api_gateway_integration.stores_post_integration,
    aws_api_gateway_integration.store_get_integration,
    aws_api_gateway_integration.store_put_integration,
    aws_api_gateway_integration.stores_get_integration,
    aws_api_gateway_integration.uploads_integration,
  ]

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode([
      aws_api_gateway_method.sign_up_post_method,
      aws_api_gateway_method.uploads_post_method,
      aws_api_gateway_method.stores_post_method,
      aws_api_gateway_method.store_get_method,
      aws_api_gateway_method.store_put_method,
      aws_api_gateway_method.stores_get_method,
      aws_api_gateway_integration.sign_up_integration,
      aws_api_gateway_integration.stores_post_integration,
      aws_api_gateway_integration.store_get_integration,
      aws_api_gateway_integration.store_put_integration,
      aws_api_gateway_integration.stores_get_integration,
      aws_api_gateway_integration.uploads_integration,
      module.cors_configuration_stores_resource,
      module.cors_configuration_workspace_resource,
      module.cors_configuration_uploads_resource
    ]))
  }

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
