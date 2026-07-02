#!/bin/bash
set -e

echo "🚀 Deploying Edge Functions to Supabase..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "🔐 Checking Supabase login..."
supabase projects list &> /dev/null || supabase login

# Get project ref
echo "📋 Available projects:"
supabase projects list

echo ""
read -p "Enter your project ref (e.g., uchmopqiylywnemvjttl): " PROJECT_REF

# Link to project
echo "🔗 Linking to project..."
supabase link --project-ref $PROJECT_REF

# Deploy functions
echo ""
echo "📦 Deploying Edge Functions..."
echo ""

echo "1/3 Deploying telegram-scraper..."
supabase functions deploy telegram-scraper --no-verify-jwt

echo ""
echo "2/3 Deploying fetch-news..."
supabase functions deploy fetch-news --no-verify-jwt

echo ""
echo "3/3 Deploying pre-moderate-news..."
supabase functions deploy pre-moderate-news --no-verify-jwt

echo ""
echo "✅ All functions deployed successfully!"
echo ""
echo "🧪 Test the changes by running a new Telegram scan."
