# CI/CD Pipeline Setup Guide

## Overview

This project includes an automated GitHub Actions workflow that builds and deploys the Vue.js application to AWS S3 and invalidates the CloudFront cache on every push to the `main` or `master` branch.

**Workflow File:** `.github/workflows/deploy.yml`

## Deployment Details

| Component | Value |
|-----------|-------|
| **S3 Bucket** | `shadcn-vue-landing-page-1765463304` |
| **CloudFront Distribution ID** | `EY5LNULFGYMLR` |
| **CloudFront URL** | `https://d1yv1zt51luay2.cloudfront.net` |
| **AWS Region** | `us-east-1` |

## Required GitHub Secrets

To enable the CI/CD pipeline, you must configure the following GitHub Secrets in your repository:

### 1. **AWS_ACCESS_KEY_ID**
   - Your AWS Access Key ID for programmatic access
   - How to get it: [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - **Important:** Use an IAM user with limited permissions (see below)

### 2. **AWS_SECRET_ACCESS_KEY**
   - Your AWS Secret Access Key corresponding to the Access Key ID
   - How to get it: [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - **Keep this secret!** Never commit it to your repository

### 3. **AWS_ROLE_ARN** (Optional, for OIDC)
   - For enhanced security, use AWS Identity and Access Management with OIDC
   - This is optional if using Access Key ID method above
   - If not using OIDC, you can leave this empty

## Setting Up GitHub Secrets

1. Go to your GitHub repository: `https://github.com/PawRush/shadcn-vue-landing-page`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

## AWS IAM Policy

Create an IAM user or role with the following minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::shadcn-vue-landing-page-1765463304",
        "arn:aws:s3:::shadcn-vue-landing-page-1765463304/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/EY5LNULFGYMLR"
    }
  ]
}
```

Replace `ACCOUNT_ID` with your AWS account ID.

## How It Works

### Trigger
The workflow is triggered on any push to the `main` or `master` branch (excluding markdown and license file changes).

### Steps
1. **Checkout code** - Clones the repository
2. **Setup Node.js** - Installs Node.js 20 with npm caching
3. **Install dependencies** - Runs `npm ci` for clean installs
4. **Build application** - Runs `npm run build` to create the production bundle
5. **Configure AWS credentials** - Authenticates with AWS using provided credentials
6. **Deploy to S3** - Uploads files to the S3 bucket
   - Cached assets (JS, CSS, images): 1 year cache control
   - HTML file: 1 hour cache control (for quick updates)
   - Deleted local files are removed from S3
7. **Invalidate CloudFront cache** - Clears CloudFront distribution cache (`/*`)
8. **Summary** - Displays deployment confirmation

## Workflow File Location

`.github/workflows/deploy.yml`

## Testing the Pipeline

To test the CI/CD pipeline:

1. Make a small change to the codebase
2. Commit and push to `main` or `master` branch
3. Go to **Actions** tab in your GitHub repository
4. Click on the latest workflow run
5. Monitor the logs to ensure all steps complete successfully

## Monitoring

- **GitHub Actions Dashboard**: `https://github.com/PawRush/shadcn-vue-landing-page/actions`
- **Failed deployments**: Check the workflow logs for error details
- **Manual runs**: You can manually trigger the workflow from the Actions tab

## Environment Variables

The workflow uses the following environment variables:

| Variable | Value | Purpose |
|----------|-------|---------|
| `S3_BUCKET` | `shadcn-vue-landing-page-1765463304` | Target S3 bucket |
| `CLOUDFRONT_DISTRIBUTION_ID` | `EY5LNULFGYMLR` | CloudFront distribution to invalidate |

## Troubleshooting

### Deployment fails with "Access Denied" error
- Verify your AWS Access Key ID and Secret Access Key are correct
- Ensure the IAM user has the required permissions (see above)
- Check that the S3 bucket name and CloudFront ID are correct

### CloudFront invalidation fails
- Confirm the CloudFront Distribution ID is correct: `EY5LNULFGYMLR`
- Ensure the IAM user has `cloudfront:CreateInvalidation` permission

### Build fails
- Check that all dependencies are correctly listed in `package.json`
- Run `npm run build` locally to reproduce the issue
- Verify Node.js version compatibility (using Node.js 20)

## Future Updates

To update the pipeline:

1. Edit `.github/workflows/deploy.yml`
2. Commit and push changes
3. The updated workflow will be used on the next push

To change the S3 bucket or CloudFront distribution:

1. Update `S3_BUCKET` and `CLOUDFRONT_DISTRIBUTION_ID` values in the workflow file
2. Commit and push
3. Update corresponding GitHub Secrets if needed

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS CLI S3 Commands](https://docs.aws.amazon.com/cli/latest/reference/s3/)
- [CloudFront Invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
