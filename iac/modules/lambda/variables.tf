variable "aws_region" { type = string }
variable "namespace" { type = string }
variable "lambda_name" { type = string }
variable "lambda_handler" { type = string }
variable "archive_file" { type = string }
variable "environment_vars" {}
variable "memory_size" {}
variable "enable_tracing" {
  type    = bool
  default = true
}
variable "common_aws_tags" {}

variable "lambda_timeout" {
  type    = number
  default = 30
}

variable "provisioned_concurrent_executions" {
  type    = number
  default = 1
}
