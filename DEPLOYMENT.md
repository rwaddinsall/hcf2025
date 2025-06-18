# 🚀 Netlify Deployment Guide

This guide walks you through deploying the Hopkins Creek Festival website to Netlify.

## 📋 Prerequisites

- [Netlify Account](https://netlify.com) (free tier works)
- [Strapi CMS deployed](https://strapi.io/deployment) (Heroku, Railway, or similar)
- GitHub repository with your code

## 🔧 Environment Setup

### 1. Strapi CMS Deployment

First, ensure your Strapi CMS is deployed and accessible:

**Options for Strapi hosting:**

- [Heroku](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/heroku.html)
- [Railway](https://railway.app/) (recommended for simplicity)
- [DigitalOcean](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/digitalocean.html)
- [AWS](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/amazon-aws.html)

**Important:** Make sure your Strapi instance is configured to allow requests from your Netlify domain.

### 2. Environment Variables

In Netlify, go to **Site settings > Environment variables** and add:

```bash
# Required
PUBLIC_STRAPI_URL=https://your-strapi-instance.herokuapp.com
PUBLIC_SITE_URL=https://your-site.netlify.app

# Optional (for analytics)
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
```

## 🌐 Netlify Deployment Options

### Option A: GitHub Integration (Recommended)

1. **Connect GitHub Repository**

   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub and select your repository

2. **Configure Build Settings**

   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 20
   ```

3. **Deploy**
   - Netlify will automatically build and deploy
   - Your site will be available at `https://random-name.netlify.app`

### Option B: Manual Deployment

1. **Build Locally**

   ```bash
   # Install dependencies
   npm install

   # Set environment variables
   export PUBLIC_STRAPI_URL=https://your-strapi-url.com
   export PUBLIC_SITE_URL=https://your-site.netlify.app

   # Build the site
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [netlify.com/drop](https://netlify.com/drop)

## ⚙️ Configuration Files

The following files are configured for optimal Netlify deployment:

### `netlify.toml`

- Build settings and optimization
- Security headers
- Cache control
- Redirect rules

### `public/_redirects`

- URL redirects and rewrites
- 404 handling
- Security rules

### `.env.example`

- Template for environment variables
- Copy to `.env` for local development

## 🔍 Deployment Validation

Use the deployment script to validate your setup:

```bash
# Run pre-deployment checks
npm run deploy:prepare

# Build with validation
npm run deploy:build
```

## 🚨 Troubleshooting

### Common Issues

**Build Fails with "Cannot find module"**

```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Strapi Content Not Loading**

- Check `PUBLIC_STRAPI_URL` is correct
- Verify Strapi CORS settings allow your Netlify domain
- Check Strapi API permissions

**CSS/Styling Issues**

- Ensure Tailwind and Sass are properly configured
- Check for missing assets in build

**404 on Page Refresh**

- Verify `_redirects` file is in `public/` directory
- Check redirect rules in `netlify.toml`

### Performance Optimization

1. **Enable Branch Previews**

   - Go to Site settings > Build & deploy > Deploy contexts
   - Enable "Deploy previews" for pull requests

2. **Lighthouse Audit**

   - The `netlify.toml` includes Lighthouse plugin
   - Check build logs for performance scores

3. **Asset Optimization**
   - Images are optimized via Astro's Image component
   - Fonts are preloaded for better performance

## 📊 Monitoring

### Build Status

- Check build logs in Netlify dashboard
- Set up build notifications in Site settings > Build notifications

### Performance

- Use built-in Lighthouse integration
- Monitor Core Web Vitals in Google Search Console

### Uptime

- Set up monitoring with [UptimeRobot](https://uptimerobot.com/) or similar
- Monitor both your main site and Strapi API

## 🔐 Security

### Headers

Security headers are configured in `netlify.toml`:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

### HTTPS

- Automatic HTTPS via Netlify
- Force HTTPS redirects in `_redirects`

## 📈 Post-Deployment Checklist

- [ ] Site loads correctly at production URL
- [ ] All pages render without errors
- [ ] CMS content displays properly
- [ ] Forms work (if applicable)
- [ ] Mobile responsiveness
- [ ] Performance audit (Lighthouse)
- [ ] SEO basics (meta tags, sitemap)
- [ ] Analytics tracking (if configured)

## 🆘 Support

If you encounter issues:

1. Check [Netlify Documentation](https://docs.netlify.com)
2. Review [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/netlify/)
3. Check [Strapi Documentation](https://strapi.io/documentation)

---

**Need help?** Create an issue in the GitHub repository with:

- Deployment logs
- Environment details
- Specific error messages
