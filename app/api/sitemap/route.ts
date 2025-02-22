import { NextRequest, NextResponse } from "next/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitDocs AI | Generate README, Code Documentation, and More with AI",
  description: "Improve your GitHub repositories with AI-driven insights and code quality analysis.",
};

export async function GET(request: NextRequest) {
  const baseUrl = "https://gitdocs-ai.vercel.app";

  // Ensure the XML declaration is at the very start of the string
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/features</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
    status: 200,
  });
}
