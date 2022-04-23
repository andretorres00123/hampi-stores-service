locals {
  delete_files_lambda_name = "hampi_delete_files"

  delete_files_lambda_policy = templatefile("./policies/delete_files_lambda_policy.json", {
    HAMPI_UPLOADS_TABLE_ARN = aws_dynamodb_table.uploads_table.arn
  })

  delete_files_lambda_variables = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = var.AWS_NODEJS_CONNECTION_REUSE_ENABLED
    NODE_ENV                            = "production"
    HAMPI_FILES_TABLE                   = aws_dynamodb_table.uploads_table.name
  }
}

module "delete_files" {
  source           = "./modules/lambda"
  lambda_name      = local.delete_files_lambda_name
  namespace        = local.namespace
  common_aws_tags  = local.common_aws_tags
  archive_file     = "../bundles/deleteFiles.zip"
  lambda_handler   = "functions/deleteFiles/index.handler"
  aws_region       = local.region
  environment_vars = local.delete_files_lambda_variables
  memory_size      = var.LAMBDA_DEFAULT_MEMORY_SIZE
}

resource "aws_iam_role_policy" "delete_files_lambda_function_role_policy" {
  name   = "hampi_delete_files_${local.namespace}_lambda_function_policy"
  role   = module.delete_files.iam_role_name
  policy = local.delete_files_lambda_policy
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_delete_files" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.delete_files.lambda_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.delete_files.arn
}
