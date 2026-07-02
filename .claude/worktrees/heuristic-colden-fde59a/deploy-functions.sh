#!/bin/bash

# Deploy Edge Functions to Supabase
# This script uses Supabase CLI to deploy updated functions

set -e

PROJECT_REF="uchmopqiylywnemvjttl"

echo "🚀 Deploying Edge Functions to Supabase..."
echo ""

# Check if logged in
if ! supabase projects list &>/dev/null; then
  echo "⚠️  Not logged in to Supabase CLI"
  echo "Please run: supabase login"
  echo ""
  echo "Or set SUPABASE_ACCESS_TOKEN environment variable"
  exit 1
fi

# Deploy telegram-scraper
echo "📦 Deploying telegram-scraper..."
supabase functions deploy telegram-scraper --project-ref $PROJECT_REF --no-verify-jwt
echo "✅ telegram-scraper deployed"
echo ""

# Deploy fetch-news
echo "📦 Deploying fetch-news..."
supabase functions deploy fetch-news --project-ref $PROJECT_REF --no-verify-jwt
echo "✅ fetch-news deployed"
echo ""

echo "🎉 All Edge Functions deployed successfully!"
