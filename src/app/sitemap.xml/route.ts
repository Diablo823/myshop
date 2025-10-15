// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { wixClientServer } from "@/lib/wixClientServer";
import { products } from '@wix/stores';

export async function GET() {
  // Get current date for lastmod
  const today = new Date().toISOString().split('T')[0];
  
  // Base URLs
  const urls = [
    // Homepage
    {
      loc: 'https://www.uscartel.com',
      lastmod: today,
      priority: '1.0'
    },
    {
      loc: 'https://www.uscartel.com/about',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/cart',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/deals',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/contact',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/partnership',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/returns',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/legal',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/termsandconditions',
      lastmod: today,
      priority: '0.8'
    },
    {
      loc: 'https://www.uscartel.com/shipping',
      lastmod: today,
      priority: '0.8'
    },
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
          loc: `https://www.uscartel.com/list?cat=${item.slug}`,
          lastmod: today,
          priority: '0.8'
        });
      });
    }
    
    // Fetch products with pagination
    const pageSize = 100; // Maximum allowed by the API
    let allProducts: products.Product[] = []; // Correctly using products.Product
    let hasMoreItems = true;
    let currentPage = 1;
    
    while (hasMoreItems) {
      const productsPage = await wixClient.products
        .queryProducts()
        .limit(pageSize)
        .skip((currentPage - 1) * pageSize)
        .find();
      
      if (productsPage && productsPage.items && productsPage.items.length > 0) {
        allProducts = [...allProducts, ...productsPage.items];
        
        // Check if we need to fetch more items
        if (productsPage.items.length < pageSize) {
          hasMoreItems = false;
        } else {
          currentPage++;
        }
      } else {
        hasMoreItems = false;
      }
    }
    
    // Add product URLs to the sitemap
    allProducts.forEach(product => {
      if (product.slug) {
        urls.push({
          loc: `https://www.uscartel.com/products/${product.slug}`,
          lastmod: today,
          priority: '0.7'
        });
      }
    });
    
  } catch (error) {
    console.error('Failed to fetch data for sitemap:', error);
    // Add fallback URLs if API fails
    urls.push(
      {
        loc: 'https://www.uscartel.com/list?cat=all-products',
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