"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

const categories = [
  "Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Children",
  "Young Adult",
]

const languages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Japanese", value: "ja" },
  { label: "Chinese", value: "zh" },
]

export default function SearchFilters() {
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const handleReset = () => {
    setSelectedCategories([])
    setSelectedLanguages([])
    setYearRange([1900, new Date().getFullYear()])
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "year", "language"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="year">
          <AccordionTrigger>Publication Year</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={yearRange}
                min={1800}
                max={new Date().getFullYear()}
                step={1}
                value={yearRange}
                onValueChange={setYearRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{yearRange[0]}</span>
                <span className="text-sm">{yearRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="language">
          <AccordionTrigger>Language</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {languages.map((language) => (
                <div key={language.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language.value}`}
                    checked={selectedLanguages.includes(language.value)}
                    onCheckedChange={() => handleLanguageChange(language.value)}
                  />
                  <label
                    htmlFor={`language-${language.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {rating} Stars & Up
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full">Apply Filters</Button>
    </motion.div>
  )
}