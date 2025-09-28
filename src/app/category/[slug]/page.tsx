import type { Metadata } from "next"
import ProductGrid from "@/components/product-grid"

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  
  // Map URL slugs to display names
  const displayNames: { [key: string]: string } = {
    'laptops': 'Laptops',
    'desktops': 'Desktops', 
    'monitors': 'Monitors',
    'keyboards': 'Keyboards',
    'headphones': 'Headphones',
    'mouse': 'Mouse',
    'speakers': 'Speakers',
    'webcams': 'Webcams',
    'storage': 'Storage',
    'ram': 'RAM',
    'graphics-cards': 'Graphics Cards',
    'processors': 'Processors',
    'motherboards': 'Motherboards',
    'power-supply': 'Power Supply',
    'cooling': 'Cooling',
    'cases': 'Cases',
    'cables': 'Cables',
    'printers': 'Printers',
    'tablets': 'Tablets',
    'smartphones': 'Smartphones'
  }
  
  const displayName = displayNames[slug.toLowerCase()] || 
                     slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const title = `${displayName} • Category`
  
  return {
    title,
    description: `Browse products in ${displayName}`,
    alternates: { canonical: `/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  
  // Fetch products from API
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products`, {
    cache: 'no-store'
  })
  const allProducts = await res.json()
  
  const products = allProducts.filter((product: any) => {
    const productCategory = product.category.toLowerCase()
    const urlSlug = slug.toLowerCase()
    
    // Direct match
    if (productCategory === urlSlug) return true
    
    // Handle plural/singular variations
    if (productCategory === urlSlug + 's' || productCategory + 's' === urlSlug) return true
    if (productCategory === urlSlug.slice(0, -1) || productCategory.slice(0, -1) === urlSlug) return true
    
    return false
  })
  
  // Display names for categories
  const displayNames: { [key: string]: string } = {
    'laptops': 'Laptops',
    'desktops': 'Desktops', 
    'monitors': 'Monitors',
    'keyboards': 'Keyboards',
    'headphones': 'Headphones',
    'mouse': 'Mouse',
    'speakers': 'Speakers',
    'webcams': 'Webcams',
    'storage': 'Storage',
    'ram': 'RAM',
    'graphics-cards': 'Graphics Cards',
    'processors': 'Processors',
    'motherboards': 'Motherboards',
    'power-supply': 'Power Supply',
    'cooling': 'Cooling',
    'cases': 'Cases',
    'cables': 'Cables',
    'printers': 'Printers',
    'tablets': 'Tablets',
    'smartphones': 'Smartphones'
  }
  
  // Get display name or capitalize the slug
  const getDisplayName = (slug: string) => {
    return displayNames[slug.toLowerCase()] || 
           slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }
  
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground text-balance">
          {getDisplayName(slug)}
        </h1>
      </header>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Products Not Found</h2>
          <p className="text-gray-600">No products are currently available in this category.</p>
        </div>
      ) : (
        <ProductGrid items={products.map((p: any) => ({ ...p, image: p.frontImage }))} />
      )}
    </main>
  )
}
