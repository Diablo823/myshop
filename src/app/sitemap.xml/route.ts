// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { wixClientServer } from "@/lib/wixClientServer";

export async function GET() {
  // Get current date for lastmod
  const today = new Date().toISOString().split('T')[0];
  
  // Base URLs
  const urls = [
    // Homepage
    {
      loc: 'https://uscartel.com',
      lastmod: today,
      priority: '1.0'
    }
  ];
  
  try {
    // Initialize Wix client
    const wixClient = await wixClientServer();
    
    // Fetch categories
    const categories = await wixClient.collections.queryCollections().find();
    
    // Add category URLs to the sitemap
    if (categories && categories.items && categories.items.length > 0) {
      categories.items.forEach(item => {
        urls.push({
          loc: `https://uscartel.com/list?cat=${item.slug}`,
          lastmod: today,
          priority: '0.8'
        });
      });
    }
    
    // Fetch all products
    const products = await wixClient.products
      .queryProducts()
      .limit(1000) // Adjust the limit based on your product count
      .find();
    
    // Add product URLs to the sitemap
    if (products && products.items && products.items.length > 0) {
      products.items.forEach(product => {
        urls.push({
          loc: `https://uscartel.com/${product.slug}`,
          lastmod: today,
          priority: '0.7'
        });
      });
    }
    
  } catch (error) {
    console.error('Failed to fetch data for sitemap:', error);
    // Add fallback URLs if API fails
    urls.push(
      {
        loc: 'https://uscartel.com/list?cat=all-products',
        lastmod: today,
        priority: '0.8'
      }
    );
  }
  
  // Build the XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add each URL to the sitemap
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';

  // Return the XML with proper content type
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}