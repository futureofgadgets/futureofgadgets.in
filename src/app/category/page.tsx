"use client";

import Link from "next/link"
import { CATEGORIES } from "@/lib/data/products"
import { useEffect, useState } from "react"

export default function CategoriesPage() {
  const [allCategories, setAllCategories] = useState<string[]>(CATEGORIES as any);

  useEffect(() => {
    // Fetch products to get dynamic categories from admin-added products
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
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allCategories.map((category) => (
          <Link
            key={category}
            href={`/category/${category.toLowerCase()}`}
            className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-card"
          >
            <div className="text-center">
              <h3 className="font-semibold">{category}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}