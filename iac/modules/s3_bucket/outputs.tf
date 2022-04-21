output "bucket_id" {
  value = aws_s3_bucket.this.id
}

output "kms_arn" {
  value = aws_kms_key.this_encrypt_key.arn
}

output "bucket_domain_name" {
  value = aws_s3_bucket.this.bucket_domain_name
}

output "bucket_arn" {
  value = aws_s3_bucket.this.arn
}
