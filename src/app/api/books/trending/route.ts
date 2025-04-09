import { NextResponse } from "next/server"

export async function GET() {
  try {
    const queries = [
      "subject:fiction+orderBy=relevance",
      "subject:fantasy+orderBy=relevance",
      "subject:mystery+orderBy=relevance",
      "inauthor:stephen+king",
      "subject:romance+orderBy=relevance",
      "subject:science+fiction+orderBy=relevance",
    ]

    const randomQuery = queries[Math.floor(Math.random() * queries.length)]

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${randomQuery}&maxResults=12`)

    if (!response.ok) {
      throw new Error(`Google Books API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching trending books:", error)
    return NextResponse.json({ error: "Failed to fetch trending books from Google Books API" }, { status: 500 })
  }
}