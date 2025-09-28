"use client";

import Link from "next/link"
import Image from "next/image"
import { CATEGORIES, CATEGORY_IMAGES } from "@/lib/data/products"
import { useEffect, useState } from "react"

export default function CategoriesPage() {
  const [allCategories, setAllCategories] = useState<string[]>(CATEGORIES as any);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(products => {
        const dynamicCategories = products.map((p: any) => p.category || p.type).filter(Boolean);
        const uniqueCategories = [...new Set([...CATEGORIES, ...dynamicCategories])];
        setAllCategories(uniqueCategories);
      })
      .catch(() => setAllCategories(CATEGORIES as any));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Shop by Category</h1>
        <p className="text-muted-foreground mt-2">Browse our electronics and computer products</p>
      </header>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {allCategories.map((category) => {
          const imageUrl =
            CATEGORY_IMAGES[category] ||
            "https://via.placeholder.com/300x200?text=No+Image"

          return (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card"
            >
              <div className="relative w-full h-32">
                <Image
                  src={imageUrl}
                  alt={category}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold">{category}</h3>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
