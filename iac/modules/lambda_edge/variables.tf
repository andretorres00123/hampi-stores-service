variable "aws_region" { type = string }
variable "namespace" { type = string }
variable "lambda_name" { type = string }
variable "lambda_handler" { type = string }
variable "archive_file" { type = string }
variable "memory_size" {}
variable "common_aws_tags" {}

variable "lambda_timeout" {
  type    = number
  default = 5
}

variable "lambda_alarm_enabled" {
  type    = bool
  default = false
}
