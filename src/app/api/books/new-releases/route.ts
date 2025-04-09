import { NextResponse } from "next/server"

export async function GET() {
  try {
    const currentYear = new Date().getFullYear()
    
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=date:${currentYear}&orderBy=newest&maxResults=10`,
    )

    if (!response.ok) {
      throw new Error(`Google Books API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching new releases:", error)
    return NextResponse.json({ error: "Failed to fetch new releases from Google Books API" }, { status: 500 })
  }
}