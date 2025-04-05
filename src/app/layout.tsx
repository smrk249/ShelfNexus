import "./globals.css";
export const metadata = {
  title: ' ShelfNexus – Your Digital Shelf in the Reading Verse.',
  description: 'Explore and discover books effortlessly with ShelfNexus – a sleek, fast, and responsive platform to search titles, authors, and genres. Powered by the Books API.',
  icons: {  
  icon: [
      '/favicon.ico?v=4',
    ],
    apple:[ 
      '/apple-touch-icon.png?v=4',
    ],
    shortcut:[
      '/apple-touch-icon.png',
    ]
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/icon.png" type="image/png" />
      <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
