import "./globals.css";
export const metadata = {
  title: ' ShelfNexus – Your Digital Shelf in the Reading Verse.',
  description: 'Explore and discover books effortlessly with ShelfNexus – a sleek, fast, and responsive platform to search titles, authors, and genres. Powered by the Books API.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
