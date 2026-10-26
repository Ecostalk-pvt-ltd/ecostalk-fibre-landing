# Image Asset Inventory

Every photo exists as `.webp` (used first) and `.jpg` (fallback). Replace both when swapping a photo, keeping the same file name and a similar shape. Convert with any tool, for example `cwebp -q 80 photo.jpg -o photo.webp`.

Status key: **Supplied** = provided by the company. **Placeholder** = temporary stand-in. Nothing here is licensed stock.

| File (under `assets/images/`) | Used on | Purpose | Status | Replace before launch? |
|---|---|---|---|---|
| `logo/ecostalk-logo` | Header, footer, JSON-LD | Company logo (supplied JPG with white background, trimmed only) | Supplied | **Yes, ideally with a transparent PNG/SVG.** It is shown on light backgrounds (blended) and on an ivory panel in the footer. |
| `../icons/favicon-*.png`, `favicon.ico` | Browser tab | Leaf mark cropped from the logo | Supplied (derived) | Check that it looks right at 16 px |
| `hero/fibre-and-textile-samples` | Home hero, social preview | Banana fibre, stem and fabric samples | Supplied, **illustrative** (looks AI-generated) | Replace with a real fibre photo when available |
| `factory/company-signage` | Home, Infrastructure, social preview | Company signboard with address | Supplied | **Confirm** it is a real photo of installed signage; looks like a design render |
| `fibre/stem-to-fibre-overview` | Process, Home, Infrastructure | Stem-to-fibre sequence | Supplied, illustrative | Replace with real process photos |
| `fibre/process-1-stem` … `process-5-hanks` | Process page thumbnails | Crops of the overview image for stages 1–5 | Supplied (cropped), illustrative | **Yes** — use real photos of each stage |
| `fibre/fibre-hank-detail` | Products (other formats) | Fibre hank crop | Supplied (cropped), illustrative | Yes, with a real product photo |
| `sustainability/banana-plantation` | Home, Sustainability | Banana plants | Supplied (cropped from collage panel a) | **Check rights**, collage looks like a published figure |
| `sustainability/banana-pseudostems` | About, Infrastructure | Cut banana pseudostems | Supplied (panel b) | Check rights |
| `sustainability/raw-fibre-hanks` | Products, Infrastructure | Raw fibre hanks | Supplied (panel c) | Check rights; replace with your own product photo |
| `sustainability/fibre-closeup` | About, Products, Infrastructure | Processed fibre close-up | Supplied (panel d) | Check rights; replace with your own product photo |

The empty folder `images/machinery/` is reserved for equipment photos.

## Photographs we need from you

1. Factory exterior (daylight, full building with signboard).
2. Fibre extraction equipment in the working area.
3. Processing / cleaning machinery.
4. Production floor and drying area.
5. Raw banana fibre and finished fibre, close up and in bulk.
6. Packaged fibre ready for dispatch.
7. Banana plantation or residue collection (your own photos if possible).

Tips: landscape orientation, at least 1600 px wide, no people's faces without permission, no customer names or private documents in view.

## Replacement checklist

- [ ] Logo with transparent background received and tested on light and dark panels
- [ ] Signboard image confirmed as real, or replaced
- [ ] Collage image source and rights confirmed, or replaced with own photos
- [ ] Machinery and factory photos added to `infrastructure.html`
- [ ] All images under about 250 KB each (WebP) where possible
- [ ] Every new image has meaningful `alt` text and, where useful, a caption
