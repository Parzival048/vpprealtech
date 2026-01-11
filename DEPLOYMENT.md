# Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier works perfectly)
- GitHub/GitLab/Bitbucket repository (recommended) or Vercel CLI

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - VPP Realtech"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it as a **Vite** project

### Step 3: Configure Build Settings
Vercel should auto-configure, but verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables
In the Vercel project settings, add these environment variables:

```env
VITE_SUPABASE_URL=https://njabyfufktvmvrkusegl.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_WHATSAPP_NUMBER=919876543210
```

**⚠️ Important:** 
- Get these values from your `.env` file
- Never commit `.env` to Git
- Add environment variables in Vercel **before** deploying

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at `https://<your-project-name>.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy
```bash
# First deployment (will ask configuration questions)
vercel

# Production deployment
vercel --prod
```

### Add Environment Variables (CLI)
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_WHATSAPP_NUMBER
```

---

## Post-Deployment Checklist

### 1. Custom Domain (Optional)
- Go to your Vercel project → **Settings** → **Domains**
- Add your custom domain (e.g., `vpprealtech.com`)
- Update DNS records as instructed by Vercel

### 2. CORS Configuration in Supabase
If you face CORS issues:
1. Go to Supabase Dashboard → **Settings** → **API**
2. Add your Vercel domain to **Allowed Origins**:
   ```
   https://your-project.vercel.app
   https://your-custom-domain.com
   ```

### 3. Test Critical Features
✅ Admin login (`/admin`)
✅ Projects page loads with data
✅ Image uploads work
✅ Contact form submissions
✅ Blog creation

### 4. Analytics (Optional)
Vercel provides built-in analytics:
- Go to **Analytics** tab in your Vercel project
- Enable **Web Analytics** for free traffic insights

---

## Continuous Deployment

Once set up via GitHub:
- Every push to `main` branch → auto-deploys to production
- Pull requests → get preview deployments
- Rollback to any previous deployment with one click

---

## Troubleshooting

### Build Fails
**Error:** `Module not found`
**Solution:** Ensure all dependencies are in `package.json`:
```bash
npm install
```

### Environment Variables Not Working
**Error:** `undefined` values in production
**Solution:** 
1. Check variable names start with `VITE_`
2. Redeploy after adding env vars
3. Clear Vercel cache: Settings → **Clear Build Cache**

### 404 on Page Refresh
**Error:** Direct URLs return 404
**Solution:** The `vercel.json` file should fix this (already created)

### Supabase Connection Issues
**Error:** Network errors or CORS
**Solution:**
1. Verify env variables are correct
2. Check Supabase URL and key
3. Add Vercel domain to Supabase CORS settings

---

## Performance Optimization (Already Configured)

✅ **Asset Caching:** Static assets cached for 1 year
✅ **Automatic HTTPS:** SSL certificate included
✅ **Global CDN:** Fast load times worldwide
✅ **Gzip Compression:** Enabled by default
✅ **Image Optimization:** Use Vercel Image Optimization for better performance

---

## Deployment Commands Summary

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-repo>
git push -u origin main

# Or deploy directly with Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

---

## Next Steps After Deployment

1. **Test thoroughly** on the live URL
2. **Set up custom domain** if needed
3. **Configure monitoring** (Vercel Analytics or external)
4. **Update Supabase CORS** with production URL
5. **Share the live link** 🎉

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
- Supabase Docs: https://supabase.com/docs
