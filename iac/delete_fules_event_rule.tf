resource "aws_cloudwatch_event_rule" "delete_files" {
  name        = "hampi-${local.namespace}-delete-files"
  description = "Event to delete not uploaded file records"

  schedule_expression = var.DELETE_FILES_SCHEDULE_EXPRESSION
}

resource "aws_cloudwatch_event_target" "delete_files_lambda_target" {
  rule      = aws_cloudwatch_event_rule.delete_files.id
  arn       = module.delete_files.lambda_function_arn
  target_id = module.delete_files.lambda_function_name
}
