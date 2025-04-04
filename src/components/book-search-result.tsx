"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BookProps {
  book: {
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
}

export default function BookSearchResult({ book }: BookProps) {
  const [isHovered, setIsHovered] = useState(false)

  const { volumeInfo } = book
  const thumbnail =
    volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || "/placeholder.svg?height=200&width=150"

  // Truncate description
  const truncateDescription = (text?: string, maxLength = 150) => {
    if (!text) return "No description available"
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  // Clean HTML from description
  const cleanDescription = (html?: string) => {
    if (!html) return "No description available"
    return html.replace(/<\/?[^>]+(>|$)/g, "")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row h-full">
          <div className="relative w-full sm:w-1/3 aspect-[2/3] sm:aspect-auto overflow-hidden bg-muted">
            <motion.img
              src={thumbnail}
              alt={volumeInfo.title}
              className="object-cover w-full h-full"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <CardContent className="flex-1 p-4 flex flex-col">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap gap-1 mb-1">
                {volumeInfo.categories?.slice(0, 1).map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {volumeInfo.publishedDate && (
                  <Badge variant="outline" className="text-xs">
                    {new Date(volumeInfo.publishedDate).getFullYear()}
                  </Badge>
                )}
              </div>

              <h3 className="font-bold line-clamp-2">{volumeInfo.title}</h3>

              <p className="text-sm text-muted-foreground">by {volumeInfo.authors?.join(", ") || "Unknown Author"}</p>

              {volumeInfo.averageRating && (
                <div className="flex items-center gap-1">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(volumeInfo.averageRating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  <span className="ml-1 text-xs font-medium">
                    {volumeInfo.averageRating.toFixed(1)}
                    {volumeInfo.ratingsCount && (
                      <span className="text-muted-foreground"> ({volumeInfo.ratingsCount})</span>
                    )}
                  </span>
                </div>
              )}

              <p className="text-xs text-muted-foreground line-clamp-3">
                {truncateDescription(cleanDescription(volumeInfo.description))}
              </p>
            </div>

            <div className="mt-4">
              <Link href={`/book/${book.id}`}>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  View Details
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}