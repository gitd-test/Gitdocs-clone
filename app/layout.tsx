import {
  ClerkProvider,
} from '@clerk/nextjs';
import Script from 'next/script';
import './globals.css';
import { Theme } from "@radix-ui/themes";
import { AppProvider } from "@/contexts/AppContext";
import SessionWrapper from "@/lib/SessionWrapper";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionWrapper>
      <ClerkProvider dynamic>
        <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="AI-powered code analysis tool for GitHub repositories" />
            <meta name="keywords" content="GitHub, code analysis, AI, repository analysis, code quality, code review" />
            <meta name="author" content="Abhas Kumar Sinha Gitdocs ai" />
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="bingbot" content="index, follow" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          </head>
          <body style={{ backgroundColor: "#0D0D0D" }}>
            {/* Google Tag Manager */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-E0TKY71491"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-E0TKY71491');
              `}
            </Script>
            {/* End Google Tag Manager */}
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
  )
}
