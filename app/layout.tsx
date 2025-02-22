import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { AppProvider } from "@/contexts/AppContext";
import SessionWrapper from "@/lib/SessionWrapper";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
      <ClerkProvider dynamic>
        <html lang="en" dir="ltr">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Improve your GitHub repositories with AI-driven insights and code quality analysis." />
            <meta name="keywords" content="GitHub, code analysis, AI, repository analysis, code quality, code review, readme generator, AI tools for developers, Git automation" />
            <meta name="author" content="Abhas Kumar Sinha" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://gitdocs-ai.vercel.app" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <meta name="google-site-verification" content="jE8xZwoJxnDc2ICzxeLXfUNjB1xxBdMBxkwOVsxsnEY" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content="Gitdocs AI - AI-powered Code Analysis" />
            <meta property="og:description" content="Improve your GitHub repositories with AI-driven insights and code quality analysis." />
            <meta property="og:image" content="/og-image.png" />
            <meta property="og:url" content="https://gitdocs-ai.vercel.app" />
            <meta property="og:type" content="website" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Gitdocs AI - AI-powered Code Analysis" />
            <meta name="twitter:description" content="Improve your GitHub repositories with AI-driven insights and code quality analysis." />
            <meta name="twitter:image" content="/og-image.png" />
            <meta name="twitter:creator" content="@yourtwitterhandle" />

            {/* Structured Data */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Gitdocs AI",
                description: "AI-powered code analysis tool for GitHub repositories.",
                url: "https://gitdocs-ai.vercel.app",
                author: { "@type": "Person", name: "Abhas Kumar Sinha" },
                applicationCategory: "Developer Tools",
                operatingSystem: "Web-based",
                offers: { "@type": "Offer", price: "Free", priceCurrency: "USD" },
              })}
            </script>

            {/* Sitemap */}
            <link rel="sitemap" type="application/xml" title="Sitemap" href="https://gitdocs-ai.vercel.app/sitemap.xml" />

            {/* Preconnect for faster asset loading */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />

            {/* Google Analytics */}
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-E0TKY71491"></Script>
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-E0TKY71491');
              `}
            </Script>
          </head>
          <body className="bg-dark">
            <GoogleAnalytics />
            <Theme>
              <AppProvider>
                {children}
                <Analytics />
              </AppProvider>
            </Theme>
          </body>
        </html>
      </ClerkProvider>
    </SessionWrapper>
  );
}
