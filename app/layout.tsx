import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@aejkatappaja/phantom-ui/ssr.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WA Sender Pro',
  description: 'Dashboard premium per invio massivo WhatsApp — powered by WuzAPI + whatsmeow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
