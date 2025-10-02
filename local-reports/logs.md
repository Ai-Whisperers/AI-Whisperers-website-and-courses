Run npm run build

> ai-whisperers-website-and-courses@0.1.0 build
> npm install && node scripts/compile-content.js && npx prisma generate && next build


removed 1 package, and audited 241 packages in 1s

55 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (3 low, 2 moderate)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
🔨 Starting content compilation...
📁 Found 9 content files
📄 Processing: about
✅ Compiled: about.ts
📄 Processing: architecture
✅ Compiled: architecture.ts
📄 Processing: contact
✅ Compiled: contact.ts
📄 Processing: faq
✅ Compiled: faq.ts
📄 Processing: homepage
✅ Compiled: homepage.ts
📄 Processing: privacy
✅ Compiled: privacy.ts
📄 Processing: services
✅ Compiled: services.ts
📄 Processing: solutions
✅ Compiled: solutions.ts
📄 Processing: terms
✅ Compiled: terms.ts
📝 Generating content index...
🛡️  Generating fallback content...
🎉 Content compilation complete! Generated 9 content modules
📦 Output directory: /home/runner/work/AI-Whisperers-website-and-courses/AI-Whisperers-website-and-courses/src/lib/content/compiled
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v6.16.3) to ./src/generated/prisma in 189ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)

Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints

   ▲ Next.js 15.5.2
   - Experiments (use with caution):
     · optimizePackageImports

   Creating an optimized production build ...
 ✓ Compiled successfully in 20.0s
   Skipping validation of types
   Skipping linting
   Collecting page data ...
   Generating static pages (0/25) ...
   Generating static pages (6/25) 
✅ Loaded compiled content for: about
✅ Loaded compiled content for: about
✅ Loaded compiled content for: contact
✅ Loaded compiled content for: contact
   Generating static pages (12/25) 
✅ Loaded compiled content for: homepage
✅ Loaded compiled content for: homepage
✅ Loaded compiled content for: privacy
✅ Loaded compiled content for: privacy
✅ Loaded compiled content for: privacy
Error occurred prerendering page "/privacy". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: Cannot read properties of undefined (reading 'email')
    at k (.next/server/app/privacy/page.js:2:12129) {
  digest: '2239598512'
}
Export encountered an error on /privacy/page: /privacy, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null
Error: Process completed with exit code 1.