import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const id = request.url.split('/').pop();

    if (!id) {
        return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)

        if (!response.ok) {
        throw new Error(`Google Books API responded with status: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching book details:", error)
        return NextResponse.json({ error: "Failed to fetch book details from Google Books API" }, { status: 500 })
    }
}