# Ecostalk Fibre Pvt. Ltd. — Corporate Website

Static, frontend-only website (HTML5, CSS3, vanilla JavaScript). No backend, database, CMS or login.

## Structure

```
index.html  about.html  process.html  products.html
sustainability.html  infrastructure.html  contact.html  404.html
assets/
  config/site-config.js   <- edit contact details here
  css/styles.css          <- all styles (design tokens at the top)
  js/main.js              <- nav, lightbox, enquiry form, reveal animation
  images/{logo,hero,factory,machinery,fibre,sustainability}/
  icons/                  <- favicons made from the supplied logo
robots.txt  sitemap.xml  staticwebapp.config.json
scripts/set-domain.mjs  scripts/check-site.mjs
README.md  DEPLOYMENT.md  IMAGE-ASSETS.md
```

Multi-page was chosen over single-page: each page gets its own title, description and URL for search engines, and a page can be edited without touching the others. The trade-off is that the header and footer are repeated in each HTML file; when you change the menu, update all 8 files.

## Run locally

```bash
cd ecostalk-fibre
python3 -m http.server 8080      # or: npx serve .
# open http://localhost:8080
```

Opening the files by double-click mostly works too, but use a server to test the 404 page and root-relative paths.

## Check before publishing

```bash
node scripts/check-site.mjs      # internal links, image paths, anchors, leftover placeholders
```

## What to edit

| Task | Where |
|---|---|
| Email, phone, address, social links | `assets/config/site-config.js` |
| Set the production domain (canonical URLs, sitemap, robots, Open Graph, JSON-LD) | `node scripts/set-domain.mjs https://www.your-domain` |
| Replace a photo | overwrite the file in `assets/images/...` keeping the name (see `IMAGE-ASSETS.md`) |
| Colours and fonts | `:root` block at the top of `styles.css` |

The email and phone are the values you supplied. Where a value is blank, the site shows "to be announced" and nothing is faked.

## How the contact form works

The form validates the fields and sends the enquiry to **ecostalkfibre01@gmail.com** through [FormSubmit.co](https://formsubmit.co), a free third-party form-to-email service (the site has no server of its own). **One-time activation is required:** open the Contact page, submit a test enquiry, then open the activation email FormSubmit sends to that Gmail inbox and click Activate. Until then, enquiries are not delivered. Also check the Spam folder.

If sending fails (for example, no internet), the form says so, sends nothing, and shows the message text with an "Open email app" button. To disable FormSubmit and use plain mailto drafts, set `formEndpoint: ""` in `site-config.js`. Product "Enquire" buttons still open an email draft.

Privacy note: enquiry details pass through FormSubmit's servers on their way to your inbox. Free-service limits and reliability are theirs; for higher volume consider a paid form service or an Azure Function later.

## Content status

Everything is written to avoid unverified claims: no statistics, capacities, certifications, specifications, prices or machinery details. The mission and vision are your supplied text. The process stages and product categories are general and illustrative; review them against the real workflow and update the text when you can.

## Information still required from the company

1. Confirmation of the six process stages (extraction method, drying and inspection, packaging formats).
2. Confirmation of product categories; any verified grades, packaging and specifications.
3. Photographs: factory exterior, extraction equipment, processing machinery, production area, raw fibre, finished fibre, packaging.
4. Confirmation that the supplied signboard image shows the real installed signage (it looks like a design render).
5. Rights/source for the banana plant and fibre collage image (it looks like a figure from a publication).
6. Production domain name.
7. Optional: GST/CIN, certifications, social media links, an export-enquiry contact, a transparent-background (PNG/SVG) logo.
8. Decision on a branded business email address (for example `info@your-domain`) instead of Gmail.

## Testing checklist

- [ ] Viewports 360, 390, 768, 1024, 1440 px: no horizontal scroll, readable text
- [ ] Mobile menu opens/closes with button, Esc key and link tap
- [ ] Tab through every page: focus ring visible; skip link works
- [ ] Gallery: click opens viewer; arrow keys move; Esc closes; focus returns
- [ ] Contact form: empty fields show errors; valid input opens the email draft
- [ ] Product "Enquire" buttons open an email draft with the right product
- [ ] Phone link dials; map link opens Google Maps; email link opens mail app
- [ ] `node scripts/check-site.mjs` passes
- [ ] After domain set: view-source shows the right canonical, sitemap and robots URLs
- [ ] Reduced-motion setting disables animations
- [ ] 404 page appears for a wrong URL once deployed
- [ ] Lighthouse (Chrome DevTools) run on Home and Contact
