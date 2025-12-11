# Deployment Plan for The Great Dalmuti

## Overview

This is a full-stack application with:

- **Frontend**: React/Vite app (static build)
- **Backend**: Node.js/Express server with Socket.IO (requires persistent WebSocket connections)

Since Socket.IO requires persistent connections, the server cannot be deployed to serverless platforms like Vercel Functions.

## Deployment Strategy

### Vercel (Frontend) + Fly.io (Backend) ⭐ **RECOMMENDED**

**Why this is best:**

- You're already familiar with both platforms
- Vercel excels at static frontend hosting
- Fly.io handles persistent WebSocket connections well
- Cost-effective for small to medium traffic
- Easy to set up and maintain

**Architecture:**

```
Frontend (Vercel) → Backend (Fly.io)
```

---

## Step 1: Deploy Backend to Fly.io

### 1.1 Install Fly.io CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### 1.2 Login to Fly.io

```bash
fly auth login
```

### 1.3 Initialize Fly.io App

From the `server/` directory:

```bash
cd server
fly launch
```

This will:

- Create a `fly.toml` configuration file
- Ask you to name your app
- Detect your Node.js app
- Set up deployment configuration

### 1.4 Configure fly.toml

Create or update `server/fly.toml`:

```toml
app = "your-app-name"
primary_region = "iad"  # Choose closest to your users

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

### 1.5 Deploy Backend

```bash
fly deploy
```

### 1.6 Get Backend URL

After deployment, Fly.io will give you a URL like:

```
https://your-app-name.fly.dev
```

**Note this URL** - you'll need it for the frontend configuration.

### 1.8 Set Environment Variables (if needed)

```bash
fly secrets set NODE_ENV=production
```

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI (optional, can use web UI)

```bash
npm i -g vercel
```

### 2.2 Configure Build Settings

Create `client/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2.3 Set Environment Variables

In Vercel dashboard or via CLI:

```bash
cd client
vercel env add VITE_SOCKET_URL
# Enter: https://your-app-name.fly.dev
```

Or in Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add `VITE_SOCKET_URL` = `https://your-app-name.fly.dev`

### 2.4 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Set root directory to `client`
5. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variable: `VITE_SOCKET_URL` = `https://your-app-name.fly.dev`
7. Deploy

## Step 3: Configure CORS on Backend

Update `server/index.ts` to allow your Vercel domain:

```typescript
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});
```

Set environment variable in Fly.io:

```bash
fly secrets set CLIENT_URL=https://your-vercel-app.vercel.app
```

---

## Step 4: Update Client Socket URL

The client already uses environment variables:

```typescript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3001";
```

Make sure `VITE_SOCKET_URL` is set in Vercel to point to your Fly.io backend.

---

## Monitoring & Maintenance

### Fly.io Logs

```bash
fly logs
```

### Vercel Logs

Available in Vercel dashboard under "Deployments" → "Functions" tab.

### Health Check

Add a health check endpoint to your server:

```typescript
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
```

---

## Troubleshooting

### WebSocket Connection Issues

1. **Check CORS settings** - Make sure your Vercel URL is allowed
2. **Check environment variables** - Verify `VITE_SOCKET_URL` is set correctly
3. **Check Fly.io machine status** - Ensure machine is running: `fly status`
4. **Check firewall** - Fly.io should handle this automatically

### Build Failures

1. **Vercel**: Check build logs in dashboard
2. **Fly.io**: Check deployment logs with `fly logs`

### Performance Issues

1. **Scale Fly.io**: `fly scale count 2` (for more instances)
2. **Upgrade VM**: `fly scale vm shared-cpu-2x` (for more CPU)

---

## Next Steps

1. **Custom Domain**: Add your own domain to Vercel
2. **SSL Certificates**: Automatically handled by both platforms
3. **CI/CD**: Both platforms support automatic deployments from Git
4. **Monitoring**: Set up error tracking (Sentry, etc.)
5. **Analytics**: Add analytics to track usage

---

## Quick Reference

### Environment Variables

**Vercel (Frontend):**

- `VITE_SOCKET_URL` = `https://your-app-name.fly.dev`

**Fly.io (Backend):**

- `PORT` = `8080` (or auto-assigned)
- `NODE_ENV` = `production`
- `CLIENT_URL` = `https://your-app-name.vercel.app` (for CORS)

---
