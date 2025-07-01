import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes to prerender
const routes = [
  '/',
  '/#why-it-matters',
  '/#process', 
  '/#services',
  '/#analytics',
  '/#experience',
  '/#contact-form'
];

// Read the built HTML template
const templatePath = join(__dirname, 'dist', 'index.html');
const template = readFileSync(templatePath, 'utf-8');

// Generate prerendered pages
routes.forEach(route => {
  const routePath = route === '/' ? 'index' : route.replace('#', '').replace('/', '');
  const fileName = `${routePath}.html`;
  const filePath = join(__dirname, 'dist', fileName);
  
  // Create route-specific meta data
  let pageTitle = 'Workplace Mapping - Internal Communications Consulting';
  let pageDescription = 'Critical updates reach your office team but get lost before they reach frontline workers. We trace how information moves through your organization.';
  
  switch(route) {
    case '/#why-it-matters':
      pageTitle = 'Why Workplace Mapping Matters - Communication Gaps';
      pageDescription = 'Safety alerts and critical updates can stall or get lost. Learn why frontline workers miss important information and how to fix it.';
      break;
    case '/#process':
      pageTitle = 'Our Process - Workplace Mapping Methodology';
      pageDescription = 'Discover, Analyze, Design, and Sustain. Our four-step process maps communication gaps and builds systems that reach everyone.';
      break;
    case '/#services':
      pageTitle = 'Services - Communication Consulting Options';
      pageDescription = '20-Day Diagnostic, Fractional Strategist, and Infrastructure Rebuild services for distributed teams and frontline workers.';
      break;
    case '/#analytics':
      pageTitle = 'Communication Analytics - Track Message Flow';
      pageDescription = 'Real-time analytics dashboard to track how messages flow through your organization and measure communication effectiveness.';
      break;
    case '/#experience':
      pageTitle = 'Experience - James A. Brown Communications Expert';
      pageDescription = 'Award-winning journalist with 20 years managing communications for thousands of distributed employees across multiple sectors.';
      break;
    case '/#contact-form':
      pageTitle = 'Contact - Get Your Communication Diagnostic';
      pageDescription = 'Schedule a consultation or get your 20-day communication diagnostic. Stop losing critical information in communication gaps.';
      break;
  }
  
  // Replace meta tags in template
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/(<meta name="description" content=").*?(">)/, `$1${pageDescription}$2`)
    .replace(/(<meta property="og:title" content=").*?(">)/, `$1${pageTitle}$2`)
    .replace(/(<meta property="og:description" content=").*?(">)/, `$1${pageDescription}$2`)
    .replace(/(<meta name="twitter:title" content=").*?(">)/, `$1${pageTitle}$2`)
    .replace(/(<meta name="twitter:description" content=").*?(">)/, `$1${pageDescription}$2`);
  
  // Add canonical URL
  const canonicalUrl = route === '/' ? 'https://workplacemapping.com' : `https://workplacemapping.com${route}`;
  html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  
  // Add structured data for specific pages
  if (route === '/#services') {
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Workplace Mapping Services",
      "description": "Internal communications consulting for distributed teams",
      "provider": {
        "@type": "Organization",
        "name": "Workplace Mapping"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "20-Day Diagnostic",
          "price": "10000",
          "priceCurrency": "USD"
        }
      ]
    };
    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>\n</head>`);
  }
  
  if (route === '/#experience') {
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "James A. Brown",
      "jobTitle": "Communications Strategist",
      "worksFor": {
        "@type": "Organization",
        "name": "Workplace Mapping"
      },
      "description": "Award-winning journalist with 20 years of experience in internal communications"
    };
    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(personSchema)}</script>\n</head>`);
  }
  
  // Write the prerendered file
  writeFileSync(filePath, html);
  console.log(`✓ Generated ${fileName}`);
});

// Generate sitemap.xml with all routes
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://workplacemapping.com</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://workplacemapping.com/#why-it-matters</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://workplacemapping.com/#process</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://workplacemapping.com/#services</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://workplacemapping.com/#analytics</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://workplacemapping.com/#experience</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://workplacemapping.com/#contact-form</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

writeFileSync(join(__dirname, 'dist', 'sitemap.xml'), sitemap);
console.log('✓ Generated sitemap.xml');

console.log('\n🎉 Prerendering complete! Generated files:');
routes.forEach(route => {
  const routePath = route === '/' ? 'index' : route.replace('#', '').replace('/', '');
  console.log(`  - ${routePath}.html`);
});
console.log('  - sitemap.xml');