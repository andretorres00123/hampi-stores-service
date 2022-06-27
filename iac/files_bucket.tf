module "files_bucket" {
  source             = "./modules/s3_bucket"
  bucket_name        = "hampi-files-bucket"
  bucket_description = "Allow HAMPI to store files"
  common_aws_tags    = local.common_aws_tags
  namespace          = local.namespace
}

resource "aws_s3_bucket_accelerate_configuration" "files_bucket_acceleration" {
  bucket = module.files_bucket.bucket_id
  status = "Enabled"
}

# resource "aws_s3_bucket_policy" "files_bucket_policy" {
#   bucket = module.files_bucket.bucket_id
#   policy = data.aws_iam_policy_document.files_bucket_policy_document.json
# }

# data "aws_iam_policy_document" "files_bucket_policy_document" {
#   statement {
#     actions = [
#       "s3:PutObject",
#       "s3:GetObject"
#     ]
#     resources = [
#       "${module.files_bucket.bucket_arn}/*",
#     ]

#     principals {
#       type        = "AWS"
#       identifiers = [aws_cloudfront_origin_access_identity.files_oai_identity.iam_arn]
#     }
#   }
# }
