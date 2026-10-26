# Deployment Guide — Azure Static Web Apps

**Status: the site has NOT been deployed, and no domain or SSL certificate has been set up.** This guide is the plan. Re-check Azure's current pages before you start, because plans and pricing change:
- Plans: https://learn.microsoft.com/azure/static-web-apps/plans
- Custom domains: https://learn.microsoft.com/azure/static-web-apps/custom-domain
- Pricing: https://azure.microsoft.com/pricing/details/app-service/static/

## Recommended architecture

**Azure Static Web Apps + a custom domain.** It serves static files from a global network, issues and renews HTTPS certificates automatically, deploys from GitHub on every push, and supports the headers, 404 page and caching rules in `staticwebapp.config.json`. Azure Storage static website + CDN/Front Door also works, but you must assemble HTTPS, certificates and redirects yourself and it costs more. It is not justified for a brochure site.

Plan choice, as listed by Microsoft when checked (verify before you commit):

| | Free | Standard |
|---|---|---|
| Custom domains | 2 per app | 5 per app |
| Free auto-renewing SSL certificate | Yes | Yes |
| Max app size | 250 MB | 500 MB |
| Intended for | Personal projects | Production apps |
| SLA | None | Yes, with support |

This site is well under 10 MB. **Start on Free if you accept no SLA; choose Standard if the company wants a service guarantee.** Both can be switched later.

## Steps

### 1. Create and test locally
```bash
cd ecostalk-fibre
python3 -m http.server 8080
node scripts/check-site.mjs
```
Work through the testing checklist in `README.md`.

### 2. Create a Git repository
```bash
git init
git add .
git commit -m "Initial Ecostalk website"
```

### 3. Push to GitHub
Create an empty repository on github.com (private is fine), then:
```bash
git branch -M main
git remote add origin https://github.com/<your-account>/ecostalk-fibre.git
git push -u origin main
```

### 4. Create the hosting resource
Azure Portal → **Create a resource → Static Web App**.
- Plan type: Free or Standard. Region: pick one close to India for the management region (content is served globally).
- Deployment source: **GitHub**, sign in, choose the repo and branch `main`.
- Build presets: **Custom**. App location: `/`. Api location: empty. Output location: empty.
- Create. Azure adds a GitHub Actions workflow to your repo.

### 5. Deploy
The first push deploys automatically. Open the generated `*.azurestaticapps.net` URL from the Azure Portal and check the site.

### 6. Register a domain
Buy a domain from a registrar (for example GoDaddy, Namecheap, Cloudflare, or an Indian registrar). Prefer a registrar that lets you edit **CNAME, TXT and ALIAS/ANAME** records. Microsoft notes some registrars (e.g. GoDaddy, Squarespace) do not support ALIAS/ANAME for the apex domain; for those, use `www` as the main address or host DNS in Azure DNS.

### 7. Configure DNS (recommended: use `www` as the main address)
In the Azure Portal: Static Web App → **Custom domains → Add**. Azure shows the exact records to create. Typically:

| Type | Host | Value |
|---|---|---|
| CNAME | `www` | `<your-app>.azurestaticapps.net` |
| TXT | provided by Azure (ownership validation) | token shown in the portal |

For the bare domain (`example.com`), Azure needs an ALIAS/ANAME (or CNAME flattening) record, or DNS hosted in Azure DNS. Set `www` as the primary and redirect the bare domain to it at your DNS/registrar if it supports URL redirect. DNS changes can take minutes to hours.

### 8. Add the custom domain
Finish the wizard in the portal. Wait for status **Ready**.

### 9. SSL/TLS
Azure issues a free certificate for custom domains automatically and renews it. The domain must resolve publicly for renewal. Check `https://www.your-domain` shows the padlock.

### 10. HTTPS-only
Azure Static Web Apps serves HTTPS and redirects HTTP to HTTPS by default. Confirm by opening `http://www.your-domain` and checking you land on `https://`. `staticwebapp.config.json` also sends an HSTS header.

### 11. Set the domain in the site files
Replace the `__SITE_URL__` placeholder (canonical, Open Graph, JSON-LD, sitemap, robots):
```bash
node scripts/set-domain.mjs https://www.your-domain.com
```
Also set `productionDomain` in `assets/config/site-config.js`, then:
```bash
git add . && git commit -m "Set production domain" && git push
```

### 12. Verify
- [ ] Desktop and phone: all pages, menu, gallery, form
- [ ] View source on each page: unique `<title>`, description, correct canonical
- [ ] `https://www.your-domain/sitemap.xml` and `/robots.txt` load with your domain
- [ ] Contact: phone, email and map links work; submit a test enquiry and activate FormSubmit (see README)
- [ ] A wrong URL shows the 404 page
- [ ] DevTools console shows no mixed-content or CSP errors (the CSP allows only Google Fonts as an external source; if you add other third-party tools, update the CSP)
- [ ] Submit the sitemap in Google Search Console (also useful for Bing Webmaster Tools)
- [ ] Rich results test on the Home page (Organization data)

### 13. Future updates
Edit files, then `git add . && git commit -m "Update ..." && git push`. GitHub Actions redeploys in a minute or two. Every pull request also gets a preview URL. Images are cached for a year, so when you replace a photo use a **new file name** (for example `...-v2.webp`) or visitors may see the old one.

## Expected costs (check current prices before buying)

| Item | Recurring? | Typical cost | Notes |
|---|---|---|---|
| Domain registration and renewal | Yearly | Roughly ₹700–1,500/year for `.in`/`.com`; renewal can cost more than the first year | Depends on registrar and extension |
| Azure Static Web Apps **Free** | Monthly | ₹0 | No SLA; limits apply, including bandwidth |
| Azure Static Web Apps **Standard** | Monthly | A small fixed monthly fee per app plus usage beyond included bandwidth. See the Azure pricing page for today's amount | SLA and support |
| SSL certificate | — | Included, free | Auto-renewed |
| GitHub private/public repo | — | Free | Free tier is enough |
| Business email (optional) | Monthly per mailbox | Gmail address: free. Branded mailbox (Google Workspace, Zoho Mail, Microsoft 365): paid per user, Zoho has a limited free plan | Needed only if you want `name@your-domain` |
| Premium services (optional) | Varies | Azure Front Door/WAF, paid analytics, SEO tools | Not required |

Minimum realistic cost: **a domain only (yearly)**, with hosting free on the Free plan. Add Standard if you want an SLA.

## Security notes
- No secrets live in this site. Never add API keys or passwords to any file.
- The mailto form needs no server. If you later want a real form backend, add it deliberately (Azure Function or a form service) and update the CSP.
- Security headers are in `staticwebapp.config.json`. They apply on Azure Static Web Apps; other hosts need the same headers configured.
