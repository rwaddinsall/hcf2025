#!/bin/bash

# Hopkins Creek Festival - Netlify Deployment Script
# This script ensures proper build setup and validation

set -e  # Exit on any error

echo "🚀 Starting Hopkins Creek Festival deployment..."

# ================================
# ENVIRONMENT VALIDATION
# ================================

echo "📋 Validating environment variables..."

# Check if required environment variables are set
if [ -z "$PUBLIC_STRAPI_URL" ]; then
    echo "❌ Error: PUBLIC_STRAPI_URL environment variable is not set"
    echo "   Please set this to your Strapi CMS URL in Netlify environment variables"
    exit 1
fi

if [ -z "$PUBLIC_SITE_URL" ]; then
    echo "⚠️  Warning: PUBLIC_SITE_URL not set, using default"
    export PUBLIC_SITE_URL="https://hopkinscreekfestival.netlify.app"
fi

echo "✅ Environment variables validated"
echo "   - Strapi URL: $PUBLIC_STRAPI_URL"
echo "   - Site URL: $PUBLIC_SITE_URL"

# ================================
# DEPENDENCY MANAGEMENT
# ================================

echo "📦 Installing dependencies..."

# Clear npm cache to avoid potential issues
npm cache clean --force

# Install dependencies
npm ci --production=false

echo "✅ Dependencies installed"

# ================================
# BUILD VALIDATION
# ================================

echo "🔍 Running pre-build validation..."

# Check TypeScript compilation
echo "   - TypeScript check..."
npm run build:check || npx astro check

# Check for linting issues (don't fail build, just warn)
echo "   - Linting check..."
npm run lint || echo "⚠️  Linting issues found (not blocking deployment)"

echo "✅ Pre-build validation complete"

# ================================
# BUILD PROCESS
# ================================

echo "🏗️  Building Astro site..."

# Set NODE_ENV for production optimizations
export NODE_ENV=production

# Build the site
npm run build

echo "✅ Build completed successfully"

# ================================
# POST-BUILD VALIDATION
# ================================

echo "🔍 Running post-build validation..."

# Check if dist directory exists and has content
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: index.html not found in dist directory"
    exit 1
fi

# Check for critical files
CRITICAL_FILES=("dist/index.html" "dist/_redirects")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ Found: $file"
    else
        echo "   ⚠️  Missing: $file"
    fi
done

# Display build stats
echo "📊 Build statistics:"
echo "   - Total files: $(find dist -type f | wc -l)"
echo "   - Total size: $(du -sh dist | cut -f1)"

echo "✅ Post-build validation complete"

# ================================
# STRAPI CONNECTIVITY CHECK
# ================================

echo "🔗 Testing Strapi connectivity..."

# Test if Strapi API is accessible
if command -v curl >/dev/null 2>&1; then
    if curl -s -f "$PUBLIC_STRAPI_URL/api/info-pages?pagination[limit]=1" >/dev/null; then
        echo "✅ Strapi API is accessible"
    else
        echo "⚠️  Warning: Could not reach Strapi API at $PUBLIC_STRAPI_URL"
        echo "   The site will still deploy but CMS content may not load"
    fi
else
    echo "⚠️  curl not available, skipping Strapi connectivity check"
fi

# ================================
# DEPLOYMENT SUMMARY
# ================================

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Deployment Summary:"
echo "   - Framework: Astro 5 (Static)"
echo "   - CMS: Strapi"
echo "   - Build output: dist/"
echo "   - Environment: production"
echo ""
echo "🚀 Ready for Netlify deployment!"
echo ""

# ================================
# HELPFUL INFORMATION
# ================================

echo "💡 Post-deployment checklist:"
echo "   □ Verify site loads at $PUBLIC_SITE_URL"
echo "   □ Test CMS content loading from Strapi"
echo "   □ Check form submissions (if applicable)"
echo "   □ Verify all pages render correctly"
echo "   □ Test responsive design on mobile devices"
echo "   □ Run Lighthouse audit for performance"
echo ""
