# Agent Instructions

This file contains instructions for coding agents working on this project.

## Deployment

See `./DEPLOYMENT.md` for deployment status, logs, troubleshooting, pipeline setup, and next steps.

### CI/CD Pipeline

This project has automated deployments configured via AWS CodePipeline.

**Pipeline:** ShadcnVuePipeline
**Trigger:** Push to `deploy-to-aws-20260129_231512-sergeyka` branch
**Production Stack:** ShadcnVueFrontend-prod

Changes pushed to the trigger branch automatically deploy to production after passing quality checks (secretlint).
