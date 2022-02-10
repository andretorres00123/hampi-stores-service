output "hampi_store_base_url" {
  value = "${aws_api_gateway_deployment.stores_api_deployment.invoke_url}${aws_api_gateway_stage.stores_api_stage.stage_name}"
}
