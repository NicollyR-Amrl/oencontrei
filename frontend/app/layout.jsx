import './globals.css'

export const metadata = {
  title: 'Next.js 16 App',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
