# 🚨 Quick Fix - npm Installation Issue

## Problem
npm cache has permission issues preventing package installation.

## One-Line Fix

Run this command to fix npm cache permissions:

```bash
sudo chown -R $(id -u):$(id -g) "$HOME/.npm"
```

## Then Install Dependencies

```bash
npm install
```

## Alternative: Fresh Start

If the above doesn't work, try:

```bash
# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## Test the Build

```bash
npm run build
```

## Start Development Server

```bash
npm run dev
```

Then open http://localhost:5173 (or the port shown in terminal)

---

**After fixing**, you can delete this file.
