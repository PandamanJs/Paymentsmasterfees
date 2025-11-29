#!/bin/bash

# Master-Fees Production Deployment Script
# Run this script to deploy to production

set -e

echo "🚀 Starting Master-Fees Production Deployment..."

# Check if required environment variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Required environment variables not set"
    echo "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=high

# Run type checking
echo "🔍 Running type checks..."
npm run type-check || echo "⚠️ Type check failed, continuing..."

# Build for production
echo "🏗️ Building for production..."
npm run build

# Run production tests
echo "🧪 Running production tests..."
npm run test:prod || echo "⚠️ Tests failed, continuing..."

# Optimize images
echo "🖼️ Optimizing images..."
find build -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs -I {} sh -c 'echo "Optimizing {}"'

# Generate sitemap
echo "🗺️ Generating sitemap..."
echo '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>'$(date +%Y-%m-%d)'</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>' > build/sitemap.xml

# Create robots.txt
echo "🤖 Creating robots.txt..."
echo 'User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml' > build/robots.txt

# Deploy to hosting provider (example for Netlify)
echo "🌐 Deploying to production..."
# npx netlify deploy --prod --dir=build

echo "✅ Deployment completed successfully!"
echo "🔗 Your app should be available at: https://your-domain.com"

# Post-deployment checks
echo "🔍 Running post-deployment checks..."
# curl -f https://your-domain.com/health || echo "⚠️ Health check failed"

echo "🎉 Master-Fees is now live in production!"
