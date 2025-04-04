"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Bookmark, Share, Star, Calendar, User, BookOpen, Building, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import BookReviews from "@/components/book-reviews"
import RelatedBooks from "@/components/related-books"

interface BookDetails {
    id: string
    volumeInfo: {
        title: string
        subtitle?: string
        authors?: string[]
        publisher?: string
        publishedDate?: string
        description?: string
        pageCount?: number
        categories?: string[]
        imageLinks?: {
        thumbnail?: string
        small?: string
        medium?: string
        large?: string
        extraLarge?: string
        }
        language?: string
        previewLink?: string
        infoLink?: string
        canonicalVolumeLink?: string
        averageRating?: number
        ratingsCount?: number
    }
    saleInfo?: {
        listPrice?: {
        amount: number
        currencyCode: string
        }
        retailPrice?: {
        amount: number
        currencyCode: string
        }
        buyLink?: string
    }
}

export default function BookDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params

    const [book, setBook] = useState<BookDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookDetails = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await fetch(`/api/books/${id}`)

            if (!response.ok) {
            throw new Error("Failed to fetch book details")
            }

            const data = await response.json()
            setBook(data)
        } catch (err) {
            console.error("Error fetching book details:", err)
            setError("Failed to load book details. Please try again later.")
        } finally {
            setLoading(false)
        }
        }

        fetchBookDetails()
    }, [id])

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading book details...</p>
            </div>
        </div>
        )
    }

    if (error || !book) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="text-muted-foreground">{error || "Book not found"}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        </div>
        )
    }

    const { volumeInfo, saleInfo } = book

    // Extract and sanitize HTML description
    const createMarkup = () => {
        return { __html: volumeInfo.description || "No description available" }
    }

    return (
        <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
                </Button>
                <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-bold">BookVerse</span>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Save</span>
                </Button>
                <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
                <span className="sr-only">Share</span>
                </Button>
            </div>
            </div>
        </header>

        <main className="container py-8">
            <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] xl:gap-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto md:mx-0 w-full max-w-[300px]"
            >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-xl">
                <img
                    src={
                    volumeInfo.imageLinks?.thumbnail ||
                    volumeInfo.imageLinks?.small ||
                    "/placeholder.svg?height=400&width=300"
                    }
                    alt={volumeInfo.title}
                    className="h-full w-full object-cover"
                />
                </div>

                <div className="mt-6 space-y-4">
                {saleInfo?.buyLink && (
                    <Button className="w-full" size="lg">
                    Buy Now
                    </Button>
                )}

                {volumeInfo.previewLink && (
                    <Button variant="outline" className="w-full">
                    Preview Book
                    </Button>
                )}

                <Button variant="secondary" className="w-full">
                    Add to Reading List
                </Button>
                </div>

                <div className="mt-6 space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                    <h3 className="font-medium">Book Details</h3>
                    <Separator />

                    <div className="space-y-2 text-sm">
                    {volumeInfo.pageCount && (
                        <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{volumeInfo.pageCount} pages</span>
                        </div>
                    )}

                    {volumeInfo.publisher && (
                        <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{volumeInfo.publisher}</span>
                        </div>
                    )}

                    {volumeInfo.publishedDate && (
                        <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {new Date(volumeInfo.publishedDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            })}
                        </span>
                        </div>
                    )}

                    {volumeInfo.language && (
                        <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span>Language: {volumeInfo.language.toUpperCase()}</span>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
            >
                <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {volumeInfo.categories?.map((category, index) => (
                    <Badge key={index} variant="secondary">
                        {category}
                    </Badge>
                    ))}
                </div>

                <h1 className="text-3xl font-bold md:text-4xl">{volumeInfo.title}</h1>

                {volumeInfo.subtitle && <p className="text-xl text-muted-foreground">{volumeInfo.subtitle}</p>}

                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                    {Array(5)
                        .fill(null)
                        .map((_, i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${
                            i < Math.floor(volumeInfo.averageRating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            }`}
                        />
                        ))}
                    </div>

                    {volumeInfo.averageRating && (
                    <span className="text-sm font-medium">
                        {volumeInfo.averageRating.toFixed(1)}
                        {volumeInfo.ratingsCount && (
                        <span className="text-muted-foreground"> ({volumeInfo.ratingsCount} ratings)</span>
                        )}
                    </span>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>By {volumeInfo.authors?.join(", ") || "Unknown Author"}</span>
                </div>
                </div>

                <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="related">Related Books</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                    <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={createMarkup()} />
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <BookReviews bookId={id as string} />
                </TabsContent>

                <TabsContent value="related" className="mt-6">
                    <RelatedBooks
                    category={volumeInfo.categories?.[0] || ""}
                    author={volumeInfo.authors?.[0] || ""}
                    currentBookId={id as string}
                    />
                </TabsContent>
                </Tabs>
            </motion.div>
            </div>
        </main>
        </div>
    )
}