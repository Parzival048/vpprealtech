# Environment Variables for Vercel

Copy these values from your local `.env` file and add them in Vercel Dashboard:

## Required Environment Variables

### Supabase Configuration
```
VITE_SUPABASE_URL=https://njabyfufktvmvrkusegl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWJ5ZnVma3R2bXZya3VzZWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1NzgwOTUsImV4cCI6MjA1MjE1NDA5NX0.t_gw9PFJHGZDKJw33T-1dP65RTlC8CWJcdLWYjYvjtY
```

### WhatsApp Integration (Optional)
```
VITE_WHATSAPP_NUMBER=919876543210
```

---

## How to Add in Vercel

### Via Dashboard:
1. Go to your project in Vercel
2. **Settings** → **Environment Variables**
3. Add each variable:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://njabyfufktvmvrkusegl.supabase.co`
   - **Environment:** Check all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your project for changes to take effect

### Via CLI:
```bash
vercel env add VITE_SUPABASE_URL production
# Enter value when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Enter value when prompted

vercel env add VITE_WHATSAPP_NUMBER production
# Enter value when prompted
```

---

## ⚠️ Security Notes

- **Never commit `.env` to Git** (already in `.gitignore`)
- The `SUPABASE_ANON_KEY` is safe to expose publicly (it's the "anonymous" key)
- For sensitive operations, Supabase uses Row Level Security (RLS)
- Admin authentication is handled securely via Supabase Auth

---

## Verify Environment Variables

After deployment, you can verify env vars are loaded:
1. Open browser console on your deployed site
2. Run: `console.log(import.meta.env.VITE_SUPABASE_URL)`
3. Should show your Supabase URL (not `undefined`)

---

## Update Environment Variables

To update variables after deployment:
1. Change the value in Vercel Dashboard
2. **Redeploy** (Settings → Deployments → Redeploy latest)
   - Or push a new commit to trigger auto-deploy
