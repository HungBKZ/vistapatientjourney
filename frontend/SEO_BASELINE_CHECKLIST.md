# SEO Baseline Checklist (GSC + GA4)

## 1) Environment variables

Create `.env` from `.env.example` and set:

- `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`
- `VITE_GSC_VERIFICATION_TOKEN=...` (token from Search Console HTML tag method)

## 2) Deploy and validate technical SEO

- Verify these URLs return real files (not homepage HTML):
  - `/robots.txt`
  - `/sitemap.xml`
- Submit sitemap URL in Google Search Console:
  - `https://vistapatientjourney.vn/sitemap.xml`

## 3) Connect Google Search Console

- Add property: `https://vistapatientjourney.vn/`
- Use HTML tag method and set token to `VITE_GSC_VERIFICATION_TOKEN`
- Confirm ownership and request indexing for:
  - `/kien-thuc`
  - `/kien-thuc/tat-khuc-xa`
  - `/kien-thuc/benh-ly-pho-bien`
  - `/kien-thuc/cham-soc-mat-man-hinh`

## 4) Connect Google Analytics 4

- Create Web Data Stream for domain `vistapatientjourney.vn`
- Set Measurement ID in `VITE_GA4_MEASUREMENT_ID`
- Verify Real-time page_view events when navigating routes

## 5) Baseline metrics to snapshot (Day 0)

From Search Console (last 28 days):
- Total clicks
- Total impressions
- Average CTR
- Average position
- Top queries for cluster pages

From GA4 (last 28 days):
- Sessions (Organic Search)
- Engaged sessions
- Engagement rate
- Average engagement time
- Top landing pages from organic traffic

## 6) Weekly reporting cadence

- Week 1-2: Monitor index coverage and crawl errors
- Week 3-4: Track CTR/title impact on new hub and long-tail URLs
- Monthly: Compare growth by cluster and prioritize next content batch
