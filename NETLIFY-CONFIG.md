# 🔧 Netlify Environment Configuration

## Your Strapi Cloud Setup

✅ **Strapi Cloud URL**: `https://healing-dance-c1ea66b091.strapiapp.com`  
✅ **Admin Panel**: `https://healing-dance-c1ea66b091.strapiapp.com/admin`  
✅ **API Base URL**: `https://healing-dance-c1ea66b091.strapiapp.com` (this is what we use)

## 📝 Environment Variables for Netlify

When you deploy to Netlify, you need to set these environment variables in your Netlify dashboard:

### Step-by-Step Netlify Configuration:

1. **Go to Netlify Dashboard**

   - Login to [app.netlify.com](https://app.netlify.com)
   - Select your Hopkins Creek Festival site

2. **Navigate to Environment Variables**

   - Go to `Site settings` → `Environment variables`
   - Click `Add a variable`

3. **Add Required Variables**

   **Variable 1:**

   ```
   Key: PUBLIC_STRAPI_URL
   Value: https://healing-dance-c1ea66b091.strapiapp.com
   ```

   **Variable 2:** (Update after deployment)

   ```
   Key: PUBLIC_SITE_URL
   Value: https://your-site-name.netlify.app
   ```

## 🚀 Deployment Steps

### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**

   - In Netlify: `Add new site` → `Import an existing project`
   - Choose GitHub and select your repository

3. **Build Settings**

   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 20
   ```

4. **Environment Variables**

   - Add the variables listed above

5. **Deploy!**
   - Click `Deploy site`

### Option B: Manual Deployment

1. **Build Locally**

   ```bash
   # Build with your Strapi URL
   npm run build
   ```

2. **Deploy**
   - Drag the `dist` folder to [netlify.com/drop](https://netlify.com/drop)

## 🔍 Testing Your Setup

### Local Testing (Already Working!)

Your `.env` file is configured correctly for local development:

```bash
npm run dev
# Visit: http://localhost:4323/
```

### Production Testing

After deployment, test these endpoints:

1. **Health Check**

   ```
   https://your-site.netlify.app/.netlify/functions/health
   ```

2. **Strapi Connection**
   - Check if CMS content loads on your pages
   - Artists should appear on the program page
   - Info content should display properly

## 🛠️ Strapi Cloud Configuration

Make sure your Strapi Cloud instance allows requests from your Netlify domain:

1. **In Strapi Admin Panel** (`https://healing-dance-c1ea66b091.strapiapp.com/admin`)
2. **Go to Settings → Users & Permissions Plugin → Roles**
3. **Configure Public Role**

   - Allow `find` and `findOne` for all content types you want to display
   - Ensure API permissions are enabled for:
     - Artists
     - Info Pages
     - General Pages
     - etc.

4. **CORS Settings** (if needed)
   - Strapi Cloud usually handles this automatically
   - If you have issues, add your Netlify domain to allowed origins

## 📋 Deployment Checklist

Before deploying:

- [x] Strapi Cloud URL configured in `.env`
- [x] Local development server running successfully
- [ ] Environment variables added to Netlify
- [ ] Repository pushed to GitHub
- [ ] Netlify site connected to repository
- [ ] Build settings configured
- [ ] Deployment triggered

After deploying:

- [ ] Site loads without errors
- [ ] Strapi content displays correctly
- [ ] All pages render properly
- [ ] Mobile responsiveness works
- [ ] Performance audit passed

## 🆘 Troubleshooting

**If CMS content doesn't load:**

1. Check Netlify environment variables are set correctly
2. Verify Strapi API permissions in admin panel
3. Check browser network tab for API errors
4. Use the health check endpoint to verify connectivity

**If build fails:**

1. Check Netlify build logs
2. Verify Node.js version is set to 20
3. Ensure all environment variables are configured

---

**Your Strapi URL is now configured! Ready to deploy to Netlify! 🚀**
