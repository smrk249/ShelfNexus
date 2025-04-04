"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

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

interface BookCarouselProps {
  books: Book[]
}

export default function BookCarousel({ books }: BookCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const isMobile = useMobile()
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const checkScrollButtons = () => {
    if (!carouselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener("resize", checkScrollButtons)
    return () => window.removeEventListener("resize", checkScrollButtons)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const scrollAmount = isMobile ? 300 : 600
    const newScrollLeft =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })

    setTimeout(checkScrollButtons, 500)
  }

  // Handle image loading error
  const handleImageError = (bookId: string) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }))
  }

  // Get fallback cover URL
  const getFallbackCover = (title: string) => {
    return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(title)}`
  }

  // If no books are provided, show placeholder
  if (!books || books.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">No books available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        onScroll={checkScrollButtons}
      >
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-shrink-0 snap-start"
          >
            <Link href={`/book/${book.id}`}>
              <div className="group relative w-[180px] md:w-[220px] transition-all duration-300 hover:-translate-y-2">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={
                      imageErrors[book.id]
                        ? getFallbackCover(book.volumeInfo.title)
                        : book.volumeInfo.imageLinks?.thumbnail ||
                          book.volumeInfo.imageLinks?.smallThumbnail ||
                          getFallbackCover(book.volumeInfo.title)
                    }
                    alt={book.volumeInfo.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(book.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <h3 className="font-medium line-clamp-1">{book.volumeInfo.title}</h3>
                  <p className="text-xs text-muted-foreground">{book.volumeInfo.authors?.[0] || "Unknown Author"}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="absolute -left-4 top-1/3 transform -translate-y-1/2 hidden md:block">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      </div>

      <div className="absolute -right-4 top-1/3 transform -translate-y-1/2 hidden md:block">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-6 md:hidden">
        <Button variant="outline" size="icon" onClick={() => scroll("left")} disabled={!canScrollLeft}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
        <Button variant="outline" size="icon" onClick={() => scroll("right")} disabled={!canScrollRight}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>
    </div>
  )
}