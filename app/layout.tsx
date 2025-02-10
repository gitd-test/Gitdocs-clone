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
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="AI-powered code analysis tool for GitHub repositories" />
            <meta name="keywords" content="GitHub, code analysis, AI, repository analysis, code quality, code review, readme generator" />
            <meta name="author" content="Abhas Kumar Sinha" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://yourwebsite.com" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            {/* Open Graph Meta Tags */}
            <meta property="og:title" content="Gitdocs AI - AI-powered Code Analysis" />
            <meta property="og:description" content="Improve your GitHub repositories with AI-driven insights and code quality analysis." />
            <meta property="og:image" content="/og-image.png" />
            <meta property="og:url" content="https://yourwebsite.com" />
            <meta property="og:type" content="website" />
            {/* Structured Data */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Gitdocs AI",
                description: "AI-powered code analysis tool for GitHub repositories.",
                url: "https://yourwebsite.com",
                author: { "@type": "Person", name: "Abhas Kumar Sinha" },
                applicationCategory: "Developer Tools",
                operatingSystem: "Web-based",
                offers: { "@type": "Offer", price: "Free", priceCurrency: "USD" },
              })}
            </script>
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
