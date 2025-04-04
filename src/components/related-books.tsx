"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import BookSearchResult from "./book-search-result"

interface RelatedBooksProps {
  category: string
  author: string
  currentBookId: string
}

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

export default function RelatedBooks({ category, author, currentBookId }: RelatedBooksProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!category && !author) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Try to find by category first, then by author if no results
        const query = category ? `subject:${category}` : `inauthor:${author}`

        const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}&maxResults=6`)
        const data = await response.json()

        if (data.items) {
          // Filter out the current book
          const filteredBooks = data.items.filter((book: Book) => book.id !== currentBookId)
          setBooks(filteredBooks.slice(0, 3)) // Limit to 3 books
        } else {
          setBooks([])
        }
      } catch (error) {
        console.error("Error fetching related books:", error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedBooks()
  }, [category, author, currentBookId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No related books found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">You might also like</h3>

      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {books.map((book) => (
          <BookSearchResult key={book.id} book={book} />
        ))}
      </motion.div>
    </div>
  )
}