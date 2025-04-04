import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const maxResults = searchParams.get("maxResults") || "10"

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    try {
        const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
        )

        if (!response.ok) {
        throw new Error(`Google Books API responded with status: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching books:", error)
        return NextResponse.json({ error: "Failed to fetch books from Google Books API" }, { status: 500 })
    }
}