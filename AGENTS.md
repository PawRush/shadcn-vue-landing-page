# Agents Guide

This document provides information for AI coding agents working on this project.

## Deployment

See `./DEPLOYMENT.md` for deployment status, logs, troubleshooting, pipeline setup, and next steps.

### CI/CD Pipeline

- **Pipeline Name:** ShadcnVuePipeline
- **Branch:** deploy-to-aws
- **Auto-deploys:** When pushing to deploy-to-aws branch
- **Console:** https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/ShadcnVuePipeline/view

### Manual Deployment

- Preview environment: `./scripts/deploy.sh`
- Preview URL: https://d1tipxopsfd27t.cloudfront.net

## Project Overview

This is a Shadcn/Vue landing page template using Vue, Shadcn/Vue + TypeScript + Tailwind CSS.

## Build Configuration

- Framework: Vite + Vue.js
- Package Manager: npm
- Build Command: `npm run build`
- Output Directory: `dist/`
- Dev Command: `npm run dev`

## Testing

- E2E Tests: `npm run test:e2e` (Playwright)
