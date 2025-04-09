import { NextResponse } from "next/server"

export async function GET() {
  try {
    const featuredQueries = [
      "intitle:dune",
      "intitle:harry+potter",
      "intitle:lord+of+the+rings",
      "intitle:project+hail+mary",
      "intitle:the+midnight+library",
    ]

    const randomQuery = featuredQueries[Math.floor(Math.random() * featuredQueries.length)]

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${randomQuery}&maxResults=1`)

    if (!response.ok) {
      throw new Error(`Google Books API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      return NextResponse.json(data.items[0])
    } else {
      throw new Error("No featured book found")
    }
  } catch (error) {
    console.error("Error fetching featured book:", error)
    return NextResponse.json({ error: "Failed to fetch featured book from Google Books API" }, { status: 500 })
  }
}