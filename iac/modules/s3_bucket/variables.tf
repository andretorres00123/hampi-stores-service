variable "bucket_name" {
  type = string
}

variable "bucket_description" {
  type = string
}

variable "allowed_origins" {
  type    = list(string)
  default = ["*"]
}

variable "enable_versioning" {
  type    = bool
  default = false
}

variable "common_aws_tags" {}
variable "namespace" {}
