module "files_bucket" {
  source             = "./modules/s3_bucket"
  bucket_name        = "hampi-files-bucket"
  bucket_description = "Allow HAMPI to store files"
  common_aws_tags    = local.common_aws_tags
  namespace          = local.namespace
  account_arn        = local.account_arn
}
