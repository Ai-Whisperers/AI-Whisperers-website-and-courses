# Environment Variables Setup Guide

This document explains how to configure environment variables for contact information and other sensitive data.

## Overview

The AI Whisperers website uses environment variables to manage contact information, preventing hardcoded values in the codebase. This approach:

- ✅ Keeps sensitive contact info out of version control
- ✅ Allows different values for development, staging, and production
- ✅ Simplifies updates without code changes
- ✅ Follows security best practices

## How It Works

1. **Content Files**: YAML files use placeholder syntax `${ENV_VARIABLE_NAME}`
2. **Compilation**: The `compile-content.js` script replaces placeholders with actual values at build time
3. **Build Process**: Environment variables are loaded from `.env.local` (local) or build arguments (Docker/Render)

## Local Development Setup

### Step 1: Create `.env.local`

Copy the example file and customize it:

```bash
cp .env.example .env.local
```

### Step 2: Configure Your Values

Edit `.env.local` with your real contact information:

```bash
# Company Contact Information
NEXT_PUBLIC_COMPANY_NAME="AI Whisperers"
NEXT_PUBLIC_CONTACT_EMAIL="ai.whisperer.wvdp@gmail.com"
NEXT_PUBLIC_SUPPORT_EMAIL="ai.whisperer.wvdp@gmail.com"
NEXT_PUBLIC_PRIVACY_EMAIL="ai.whisperer.wvdp@gmail.com"
NEXT_PUBLIC_LEGAL_EMAIL="ai.whisperer.wvdp@gmail.com"
NEXT_PUBLIC_CONTACT_PHONE="+595 981 123456"
NEXT_PUBLIC_OFFICE_STREET="Asunción Tech Hub"
NEXT_PUBLIC_OFFICE_CITY="Asunción"
NEXT_PUBLIC_OFFICE_COUNTRY="Paraguay"
NEXT_PUBLIC_OFFICE_ZIP="1209"
NEXT_PUBLIC_GITHUB_ORG="https://github.com/Ai-Whisperers"
```

### Step 3: Compile Content

Run the content compilation script to inject environment variables:

```bash
npm run compile-content
```

### Step 4: Start Development Server

```bash
npm run dev
```

The website will now use your configured contact information.

## Docker Build Setup

### Local Docker Build

To build with environment variables from `.env.local`:

```bash
docker build -t ai-whisperers-website .
```

The Dockerfile automatically picks up environment variables during the build stage.

### Custom Docker Build Arguments

Override specific values at build time:

```bash
docker build \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL="custom@example.com" \
  --build-arg NEXT_PUBLIC_CONTACT_PHONE="+1234567890" \
  -t ai-whisperers-website .
```

## Production Deployment (Render)

### Step 1: Set Environment Variables in Render Dashboard

1. Go to your Render service dashboard
2. Navigate to **Environment** section
3. Add the following environment variables:

```
NEXT_PUBLIC_COMPANY_NAME=AI Whisperers
NEXT_PUBLIC_CONTACT_EMAIL=ai.whisperer.wvdp@gmail.com
NEXT_PUBLIC_SUPPORT_EMAIL=ai.whisperer.wvdp@gmail.com
NEXT_PUBLIC_PRIVACY_EMAIL=ai.whisperer.wvdp@gmail.com
NEXT_PUBLIC_LEGAL_EMAIL=ai.whisperer.wvdp@gmail.com
NEXT_PUBLIC_CONTACT_PHONE=+595 981 123456
NEXT_PUBLIC_OFFICE_STREET=Asunción Tech Hub
NEXT_PUBLIC_OFFICE_CITY=Asunción
NEXT_PUBLIC_OFFICE_COUNTRY=Paraguay
NEXT_PUBLIC_OFFICE_ZIP=1209
NEXT_PUBLIC_GITHUB_ORG=https://github.com/Ai-Whisperers
```

### Step 2: Deploy

Render will automatically inject these values during the build process.

## Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_COMPANY_NAME` | Company brand name | `AI Whisperers` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Primary contact email | `info@aiwhisperers.com` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support team email | `support@aiwhisperers.com` |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | Privacy inquiries email | `privacy@aiwhisperers.com` |
| `NEXT_PUBLIC_LEGAL_EMAIL` | Legal team email | `legal@aiwhisperers.com` |
| `NEXT_PUBLIC_CONTACT_PHONE` | Contact phone number | `+1 (555) 123-4567` |
| `NEXT_PUBLIC_OFFICE_STREET` | Office street address | `123 Innovation Drive` |
| `NEXT_PUBLIC_OFFICE_CITY` | Office city | `Tech Valley` |
| `NEXT_PUBLIC_OFFICE_COUNTRY` | Office country | `USA` |
| `NEXT_PUBLIC_OFFICE_ZIP` | Office ZIP/postal code | `94000` |
| `NEXT_PUBLIC_GITHUB_ORG` | GitHub organization URL | `https://github.com/Ai-Whisperers` |

## Files Modified

### Content Files (YAML)
- `src/content/pages/contact.yml` - Contact page with email, phone, address
- `src/content/pages/privacy.yml` - Privacy team contact info
- `src/content/pages/terms.yml` - Legal team contact info

### Configuration Files
- `.env.example` - Template with all available variables
- `.env.local` - Your local configuration (not in git)
- `Dockerfile` - Build-time ARG declarations

### Build Scripts
- `scripts/compile-content.js` - Loads `.env.local` and replaces placeholders

## Troubleshooting

### Issue: Environment Variables Not Replacing

**Solution**: Make sure you run `npm run compile-content` after changing `.env.local`

```bash
npm run compile-content
```

### Issue: Placeholders Still Visible in Production

**Solution**: Verify environment variables are set in Render dashboard and redeploy

### Issue: Docker Build Uses Wrong Values

**Solution**: Pass build arguments explicitly:

```bash
docker build --build-arg NEXT_PUBLIC_CONTACT_EMAIL="correct@example.com" -t ai-whisperers-website .
```

### Issue: Changes Not Reflected

**Solution**: Clear Next.js cache and rebuild:

```bash
rm -rf .next
npm run compile-content
npm run build
```

## Security Notes

- ✅ `.env.local` is in `.gitignore` - never commit it
- ✅ `NEXT_PUBLIC_*` variables are safe for client-side (non-sensitive)
- ✅ Contact info is public anyway, but this pattern prevents accidental commits
- ⚠️ For sensitive keys (API keys, secrets), use non-NEXT_PUBLIC variables

## Next Steps

After setting up environment variables:

1. Test locally with `npm run dev`
2. Verify compiled content in `src/lib/content/compiled/`
3. Test Docker build: `docker build -t test .`
4. Deploy to Render with environment variables configured

## Support

For issues with environment variable setup:
- Check `.env.local` syntax (no spaces around `=`)
- Verify quotes are matching (`"value"` or `'value'`)
- Ensure `NEXT_PUBLIC_` prefix for client-visible variables
- Review `scripts/compile-content.js` for compilation logic
