import type { Metadata } from "next"
import { products } from "@/lib/data/products"
import ProductGrid from "@/components/product-grid"
import { notFound } from "next/navigation"

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const exists = products.some((p) => p.category.toLowerCase() === slug.toLowerCase())
  if (!exists) return { title: "Category Not Found" }
  const title = `${slug} • Category`
  return {
    title,
    description: `Browse products in ${slug}`,
    alternates: { canonical: `/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const list = products.filter((p) => p.category.toLowerCase() === slug.toLowerCase() && p.status === "active")
  if (list.length === 0) notFound()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground text-balance">{slug}</h1>
      </header>
      <ProductGrid items={list} />
    </main>
  )
}
