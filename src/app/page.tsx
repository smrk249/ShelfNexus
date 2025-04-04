"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, ChevronRight, TrendingUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookCard from "@/components/book-card"
import FeaturedBook from "@/components/featured-book"
import BookCarousel from "@/components/book-carousel"
import AnimatedText from "@/components/animated-text"
import SearchBar from "@/components/search-bar"

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publishedDate?: string
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    categories?: string[]
    averageRating?: number
    ratingsCount?: number
  }
}

export default function Home() {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([])
  const [newReleases, setNewReleases] = useState<Book[]>([])
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState({
    trending: true,
    newReleases: true,
    featured: true,
  })

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await fetch("/api/books/trending")
        const data = await response.json()

        if (data.items) {
          setTrendingBooks(data.items.slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching trending books:", error)
      } finally {
        setLoading((prev) => ({ ...prev, trending: false }))
      }
    }

    const fetchNewReleases = async () => {
      try {
        const response = await fetch("/api/books/new-releases")
        const data = await response.json()

        if (data.items) {
          setNewReleases(data.items)
        }
      } catch (error) {
        console.error("Error fetching new releases:", error)
      } finally {
        setLoading((prev) => ({ ...prev, newReleases: false }))
      }
    }

    const fetchFeaturedBook = async () => {
      try {
        const response = await fetch("/api/books/featured")
        const data = await response.json()

        if (data) {
          setFeaturedBook(data)
        }
      } catch (error) {
        console.error("Error fetching featured book:", error)
      } finally {
        setLoading((prev) => ({ ...prev, featured: false }))
      }
    }

    fetchTrendingBooks()
    fetchNewReleases()
    fetchFeaturedBook()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ShelfNexus</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/genres" className="text-sm font-medium hover:text-primary transition-colors">
              Genres
            </Link>
            <Link href="/new-releases" className="text-sm font-medium hover:text-primary transition-colors">
              New Releases
            </Link>
            <Link href="/top-rated" className="text-sm font-medium hover:text-primary transition-colors">
              Top Rated
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <AnimatedText
                    text="Discover Your Next Favorite Book"
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  />
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Explore thousands of book reviews and recommendations from our community of readers and critics.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/search">
                    <Button size="lg" className="px-8">
                      Explore Books
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="px-8">
                    Join Community
                  </Button>
                </div>
              </div>
              {loading.featured ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <FeaturedBook book={featuredBook} />
              )}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Trending Now</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">This Week's Top Picks</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Discover the books everyone's talking about and add them to your reading list.
                </p>
              </div>
            </div>

            {loading.trending ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {trendingBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.volumeInfo.title}
                    author={book.volumeInfo.authors?.[0] || "Unknown Author"}
                    rating={book.volumeInfo.averageRating || 4.5}
                    coverUrl={book.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=400&width=300"}
                    genre={book.volumeInfo.categories?.[0] || "Fiction"}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <Link href="/search">
                <Button variant="outline" size="lg" className="gap-1">
                  View All Books
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Genres to Explore</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Find your perfect read by exploring our curated genre collections.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-12 md:grid-cols-3 lg:grid-cols-6">
              {[
                "Fiction",
                "Mystery",
                "Romance",
                "Sci-Fi",
                "Fantasy",
                "Biography",
                "History",
                "Self-Help",
                "Thriller",
                "Young Adult",
                "Horror",
                "Poetry",
              ].map((genre) => (
                <Link
                  key={genre}
                  href={`/search?q=subject:${genre.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-b from-background/80 to-background shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-6 text-center">
                    <h3 className="font-medium">{genre}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">New Releases</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  The latest and greatest books hot off the press.
                </p>
              </div>
            </div>

            {loading.newReleases ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="py-12">
                <BookCarousel books={newReleases} />
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              ©️ {new Date().getFullYear()} BookVerse. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}