"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookCardProps {
  id: string
  title: string
  author: string
  rating: number
  coverUrl: string
  genre: string
}

export default function BookCard({ id, title, author, rating, coverUrl, genre }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true)
  }

  // Get fallback cover URL
  const getFallbackCover = () => {
    return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(title)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <motion.img
            src={imageError ? getFallbackCover() : coverUrl}
            alt={title}
            className="object-cover w-full h-full"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            onError={handleImageError}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="font-medium">
              {genre}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-bold line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground">by {author}</p>
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? "fill-primary text-primary"
                        : i < rating
                          ? "fill-primary/50 text-primary"
                          : "fill-muted text-muted"
                    }`}
                  />
                ))}
              <span className="ml-1 text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button variant="outline" size="sm" className="w-full">
            Review
          </Button>
          <Link href={`/book/${id}`} className="w-full">
            <Button size="sm" className="w-full">
              Read More
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}