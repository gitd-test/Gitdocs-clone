import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import { Theme } from "@radix-ui/themes";
import { AppProvider } from "@/contexts/AppContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{"backgroundColor" : "#0D0D0D"}}>
          <Theme>
            <AppProvider>
              {children}
            </AppProvider>
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  )
}