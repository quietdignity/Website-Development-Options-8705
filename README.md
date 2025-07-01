# Workplace Mapping - Website

A professional website for Workplace Mapping, featuring internal communications consulting services for distributed teams and frontline workers.

## Google Analytics Setup

This project includes Google Analytics 4 (GA4) integration. To set it up:

1. **Get your GA4 Measurement ID:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property or use an existing one
   - Copy your Measurement ID (format: G-XXXXXXXXXX)

2. **Update the Measurement ID:**
   - Open `index.html`
   - Replace `GA_MEASUREMENT_ID` with your actual Measurement ID in two places:
     - In the script src URL
     - In the gtag config call
   - Also update `src/utils/analytics.js` with your Measurement ID

3. **Analytics Events Tracked:**
   - Page views and navigation
   - Form submissions (contact form)
   - Button clicks (CTA buttons, external links)
   - Scroll depth (25%, 50%, 75%, 100%)
   - Time spent on page
   - Section views
   - External link clicks

## Features

- **Responsive Design**: Works on all devices
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Analytics Integration**: Google Analytics 4 with custom events
- **Interactive Components**: Chatbot, feedback system, contact forms
- **Performance Optimized**: Fast loading with modern React practices

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The site is configured for static deployment with:
- Netlify form handling
- Google Analytics tracking
- SEO optimization
- Responsive images

Make sure to:
1. Update the GA4 Measurement ID before deploying
2. Configure your domain in Google Analytics
3. Set up Netlify form handling if using Netlify
4. Test all analytics events in GA4 Real-Time reports

## Analytics Events Reference

- `form_submit`: Contact form submissions
- `click`: Button and link clicks
- `scroll`: Scroll depth tracking
- `section_view`: Section visibility tracking
- `timing_complete`: Time on page tracking

All events include proper categorization for easy reporting in Google Analytics.