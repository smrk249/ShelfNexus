"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Loader2, BookOpen, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BookSearchResult from "@/components/book-search-result"
import SearchFilters from "@/components/search-filters"
import { motion, AnimatePresence } from "framer-motion"

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
    publisher?: string
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(query)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (query) {
      searchBooks(query)
    }
  }, [query])

  const searchBooks = async (q: string) => {
    if (!q.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(q)}&maxResults=20`)
      const data = await response.json()

      if (data.items) {
        setBooks(data.items)
      } else {
        setBooks([])
      }
    } catch (error) {
      console.error("Error searching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden sm:inline-block">BookVerse</span>
          </div>
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for books, authors, or topics..."
                className="w-full pl-8 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filters</span>
            </Button>
          </form>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden"
              >
                <SearchFilters />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden md:block w-64 shrink-0">
            <SearchFilters />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {query ? `Search results for "${query}"` : "Search for books"}
              </h1>
              {books.length > 0 && <p className="text-muted-foreground">Found {books.length} results</p>}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : books.length > 0 ? (
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {books.map((book) => (
                  <BookSearchResult key={book.id} book={book} />
                ))}
              </motion.div>
            ) : query ? (
              <div className="text-center py-20">
                <h2 className="text-xl font-medium mb-2">No books found</h2>
                <p className="text-muted-foreground">Try searching with different keywords or browse our categories</p>
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-xl font-medium mb-2">Start your search</h2>
                <p className="text-muted-foreground">Search for books by title, author, or keywords</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}