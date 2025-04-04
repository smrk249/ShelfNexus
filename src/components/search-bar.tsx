"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setOpen(false)
      setQuery("")
    }
  }

  const quickSearches = [
    { name: "Fantasy Books", query: "subject:fantasy" },
    { name: "Science Fiction", query: "subject:science+fiction" },
    { name: "Mystery Novels", query: "subject:mystery" },
    { name: "Best Sellers", query: "orderBy=relevance" },
    { name: "New Releases", query: "orderBy=newest" },
  ]

  return (
    <>
      <div className="relative hidden md:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search books..."
          className="w-[200px] pl-8 rounded-full bg-muted"
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>
      <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search books, authors, or topics..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Searches">
            {quickSearches.map((item) => (
              <CommandItem
                key={item.query}
                onSelect={() => {
                  router.push(`/search?q=${encodeURIComponent(item.query)}`)
                  setOpen(false)
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Popular Authors">
            <CommandItem
              onSelect={() => {
                router.push(`/search?q=${encodeURIComponent("inauthor:stephen+king")}`)
                setOpen(false)
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Stephen King
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push(`/search?q=${encodeURIComponent("inauthor:j.k.+rowling")}`)
                setOpen(false)
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              J.K. Rowling
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}