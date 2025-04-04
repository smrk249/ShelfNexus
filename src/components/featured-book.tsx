"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Book {
  id: string
  volumeInfo: {
    title: string
    subtitle?: string
    authors?: string[]
    publishedDate?: string
    description?: string
    imageLinks?: {
      thumbnail?: string
      small?: string
      medium?: string
      large?: string
      extraLarge?: string
    }
    categories?: string[]
    averageRating?: number
    ratingsCount?: number
  }
}

interface FeaturedBookProps {
  book: Book | null
}

export default function FeaturedBook({ book }: FeaturedBookProps) {
  const [imageError, setImageError] = useState(false)

  if (!book) {
    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute -z-10 h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-50"></div>
        </div>
        <div className="relative book-container">
          <div className="relative book-cover rounded-lg overflow-hidden shadow-2xl bg-muted">
            <div className="aspect-[2/3] w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  // Get the best available image
  const getBestImage = () => {
    const { imageLinks } = book.volumeInfo
    if (!imageLinks) return getFallbackCover()

    // Try to get the largest image available
    return imageLinks.large || imageLinks.medium || imageLinks.small || imageLinks.thumbnail || getFallbackCover()
  }

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true)
  }

  // Get fallback cover URL
  const getFallbackCover = () => {
    return `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(book.volumeInfo.title)}`
  }

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -z-10 h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-50"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, rotateY: 30 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative w-full max-w-md perspective"
      >
        <div className="relative book-container">
          {/* Book cover */}
          <div className="relative book-cover rounded-lg overflow-hidden shadow-2xl">
            <img
              src={imageError ? getFallbackCover() : getBestImage()}
              alt={book.volumeInfo.title}
              className="w-full h-auto"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
              {book.volumeInfo.categories && book.volumeInfo.categories.length > 0 && (
                <Badge className="self-start mb-2 bg-primary hover:bg-primary">{book.volumeInfo.categories[0]}</Badge>
              )}
              <h3 className="text-2xl font-bold">{book.volumeInfo.title}</h3>
              <p className="text-sm opacity-90">by {book.volumeInfo.authors?.[0] || "Unknown Author"}</p>
              <div className="flex items-center gap-1 mt-2">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(book.volumeInfo.averageRating || 4)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-white/30 text-white/30"
                      }`}
                    />
                  ))}
                <span className="ml-1 text-xs font-medium">
                  {book.volumeInfo.averageRating?.toFixed(1) || "4.2"}
                  {book.volumeInfo.ratingsCount && <span> ({book.volumeInfo.ratingsCount} reviews)</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Book page effect */}
          <div className="absolute top-0 right-0 h-full w-[3px] bg-gradient-to-l from-white/80 to-transparent transform translate-x-full"></div>
          <div className="absolute top-0 right-0 h-full w-[30px] bg-gradient-to-l from-background/5 to-transparent transform translate-x-full rounded-r-lg"></div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" size="sm">
            Read Sample
          </Button>
          <Link href={`/book/${book.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}