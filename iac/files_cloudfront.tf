locals {
  origin_id = "HAMPI_FILES_BUCKET_ORIGIN"
}

resource "aws_cloudfront_distribution" "files_bucket_distribution" {
  origin {
    domain_name = module.files_bucket.bucket_domain_name
    origin_id   = local.origin_id
  }

  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_100"

  tags = merge(local.common_aws_tags, {
    Name        = "Hampi S3 Files Bucket Cloudfront"
    Description = "Cloudfront distribution to upload files to the S3 Files Bucket"
  })

  default_cache_behavior {
    target_origin_id = local.origin_id
    cached_methods   = ["GET", "HEAD"]
    allowed_methods = [
      "HEAD",
      "OPTIONS",
      "GET",
      "DELETE",
      "POST",
      "PUT",
      "PATCH",
    ]
    min_ttl                = 0
    max_ttl                = 0
    default_ttl            = 0
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type   = "origin-request"
      include_body = false
      lambda_arn   = module.get_files_lambda.lambda_qualified_arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "blacklist"
      locations        = ["AF", "AL", "AM", "AO", "AZ", "BA", "BD", "BF", "BG", "BH", "BI", "BJ", "BN", "BO", "BT", "BW", "BY", "BZ", "CD", "CF", "CG", "CI", "CM", "CN", "CU", "CV", "CY", "CZ", "DJ", "DZ", "EE", "EG", "EH", "ER", "ET", "GA", "GE", "GH", "GM", "GN", "GQ", "GW", "HR", "HU", "ID", "IQ", "IR", "JO", "KE", "KG", "KH", "KM", "KP", "KR", "KW", "KZ", "LA", "LB", "LK", "LR", "LS", "LT", "LV", "LY", "MA", "ME", "MG", "MK", "ML", "MM", "MN", "MR", "MU", "MV", "MW", "MY", "MZ", "NA", "NE", "NG", "NI", "NP", "OM", "PH", "PK", "PS", "QA", "RE", "RO", "RS", "RU", "RW", "SC", "SD", "SG", "SH", "SI", "SK", "SL", "SN", "SO", "SS", "ST", "SY", "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TR", "TZ", "UA", "UG", "UZ", "VE", "VN", "YE", "YT", "ZM", "ZW"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  depends_on = [
    module.get_files_lambda,
    module.files_bucket
  ]
}

module "get_files_lambda" {
  source          = "./modules/lambda_edge"
  archive_file    = "../bundles/getFiles.zip"
  namespace       = local.namespace
  common_aws_tags = local.common_aws_tags
  lambda_handler  = "functions/getFiles/index.handler"
  lambda_name     = "hampi_get_files_lambda"
  aws_region      = data.aws_region.current.id
  memory_size     = 128
}

resource "aws_iam_role_policy" "get_files_lambda_function_role_policy" {
  name = "hampi_get_files_lambda_${local.namespace}_lambda_function_policy"
  role = module.get_files_lambda.iam_role_name
  policy = templatefile("./policies/get_files_lambda_policy.json", {
    FILES_BUCKET_ID         = module.files_bucket.bucket_id
    FILES_BUCKET_KMS_ARN    = module.files_bucket.kms_arn
    HAMPI_UPLOADS_TABLE_ARN = aws_dynamodb_table.uploads_table.arn
  })
}
