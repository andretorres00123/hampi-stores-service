variable "AWS_NODEJS_CONNECTION_REUSE_ENABLED" {
  type    = string
  default = "1"
}

variable "LAMBDA_DEFAULT_MEMORY_SIZE" {
  type    = number
  default = 2048
}

variable "CORS_ALLOW_ORIGIN" {
  type        = string
  default     = "*"
  description = "The CORS configuration Allow-Origin"
}

variable "DELETE_FILES_SCHEDULE_EXPRESSION" {
  type    = string
  default = "rate(1 day)"
}
