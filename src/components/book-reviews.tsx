"use client"

import { useState } from "react"
import { User, Star, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

interface BookReviewsProps {
  bookId: string
}

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2023-12-15",
    content:
      "This book completely changed my perspective on modern literature. The character development is exceptional, and the plot twists kept me engaged throughout. Highly recommended for anyone who enjoys thought-provoking fiction.",
    likes: 24,
    replies: 3,
  },
  {
    id: "2",
    user: {
      name: "Sophia Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    date: "2023-11-28",
    content:
      "A compelling read with beautiful prose. The author has a unique way of describing scenes that makes you feel like you're right there. I took away one star because the ending felt a bit rushed, but overall it was excellent.",
    likes: 18,
    replies: 2,
  },
  {
    id: "3",
    user: {
      name: "Marcus Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2023-10-05",
    content:
      "I couldn't put this book down! The storytelling is masterful and the themes are relevant to our current society. This is definitely going on my list of favorites for the year.",
    likes: 32,
    replies: 5,
  },
]

export default function BookReviews({ bookId }: BookReviewsProps) {
  const [reviews, setReviews] = useState(mockReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmitReview = () => {
    if (newReview.trim() && rating > 0) {
      const review = {
        id: Date.now().toString(),
        user: {
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        rating,
        date: new Date().toISOString().split("T")[0],
        content: newReview,
        likes: 0,
        replies: 0,
      }

      setReviews([review, ...reviews])
      setNewReview("")
      setRating(0)
      setShowReviewForm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Reader Reviews</h3>
        <Button variant="outline" onClick={() => setShowReviewForm(!showReviewForm)}>
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Your Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 cursor-pointer ${
                      star <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Share your thoughts about this book..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="min-h-[120px]"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={!newReview.trim() || rating === 0}>
                Submit Review
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                      />
                    ))}
                </div>
              </div>

              <p className="text-sm">{review.content}</p>

              <div className="flex items-center gap-4 pt-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{review.replies}</span>
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this book!</p>
          </div>
        )}
      </div>
    </div>
  )
}