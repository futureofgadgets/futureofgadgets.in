"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowUpDown } from "lucide-react";
import { CategoryBar } from "@/components/categorybar";
import Link from "next/link";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(slug);

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    if (categorySlug) {
      router.push(`/category/${categorySlug}`);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setAllProducts(data);

        // Filter by category
        if (selectedCategory) {
          const filtered = data.filter(
            (product: any) =>
              product.category?.toLowerCase() ===
              selectedCategory.toLowerCase()
          );
          setProducts(filtered);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const sortProducts = (products: any[], sortType: string) => {
    const sorted = [...products];
    switch (sortType) {
      case "price-asc":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  const sortedProducts = sortProducts(products, sortBy);

  const categories = [
    { name: "Laptops", slug: "laptops", icon: "💻", description: "High-performance laptops" },
    { name: "Desktops", slug: "desktops", icon: "🖥️", description: "Desktop computers" },
    { name: "Monitors", slug: "monitors", icon: "📺", description: "Professional displays" },
    { name: "Keyboards", slug: "keyboards", icon: "⌨️", description: "Mechanical & wireless" },
    { name: "Mouse", slug: "mouse", icon: "🖱️", description: "Gaming & ergonomic" },
    { name: "Headphones", slug: "headphones", icon: "🎧", description: "Audio devices" },
    { name: "Speakers", slug: "speakers", icon: "🔊", description: "Sound systems" },
    { name: "Webcams", slug: "webcams", icon: "📹", description: "Video cameras" },
    { name: "Storage", slug: "storage", icon: "💾", description: "Hard drives & SSDs" },
    { name: "RAM", slug: "ram", icon: "🧠", description: "Memory modules" },
  ];

  return (
    <div className="min-h-screen bg-white ">
      <div className="max-w-full mx-auto pt-10  md:py-8">
        <div className="flex gap-0">
          {/* Sidebar */}
          <div className="hidden md:block">
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              isSidebarOpen={isSidebarOpen}
              onSidebarToggle={setIsSidebarOpen}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {selectedCategory ? (
              <div>
                {/* Category Header */}
                <div className="flex sm:items-center justify-between mb-2 gap-4 xl:px-4 px-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {categories.find((c) => c.slug === selectedCategory)?.name}
                    </h2>
                    {/* <p className="text-gray-600 text-sm sm:text-base">
                      {products.length} items •{" "}
                      {categories.find((c) => c.slug === selectedCategory)?.description}
                    </p> */}
                  </div>

                  <div className="flex items-center gap-2">



                  <div className="md:block">
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              isSidebarOpen={isSidebarOpen}
              onSidebarToggle={setIsSidebarOpen}
            />
          </div>

                  {/* Sort Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-fit sm:w-auto">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setSortBy("price-asc")}>
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("price-desc")}>
                        Price: High to Low
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                        Name: A to Z
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                        Name: Z to A
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                                  </div>

                {/* Products Grid */}
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white p-4 border-y border-gray-200 animate-pulse">
                        <div className="flex gap-4">
                          <div className="w-48 h-44 bg-gray-200 rounded flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                            <div className="space-y-1 mb-3">
                              <div className="h-3 bg-gray-200 rounded w-full"></div>
                              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                            </div>
                          </div>
                          <div className="text-left mt-5">
                            <div className="h-8 bg-gray-200 rounded mb-1 w-24"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sortedProducts.length > 0 ? (
                  <div className="space-y-4">
                    {sortedProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug || product.id}`}>
                        <div className={`bg-white p-4 border-y border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${product.quantity === 0 ? 'opacity-60' : ''}`}>
                          <div className="flex gap-4">
                            <div className="w-48 h-44 flex-shrink-0 relative">
                              <CloudinaryImage
                                src={product.frontImage || product.image || '/no-image.svg'}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                              {product.quantity === 0 && (
                                <div className="absolute inset-0 bg-gray-400/40 flex items-center justify-center">
                                  <span className="bg-gray-600 text-white px-3 py-1 font-bold text-sm rounded">OUT OF STOCK</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-blue-600 mb-2 hover:underline">
                                {product.name}
                              </h3>
                              {product.rating && (
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="bg-green-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                                    <span>{product.rating}</span>
                                    <Star className="w-3 h-3 fill-current" />
                                  </div>
                                </div>
                              )}
                              {product.brand && (
                                <p className="text-sm text-gray-600 mb-2">Brand: <span className="font-medium">{product.brand}</span></p>
                              )}
                              <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                                {product.description || 'High-quality product with premium features'}
                              </p>
                              {product.quantity === 0 ? (
                                <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
                              ) : product.quantity <= 5 ? (
                                <span className="text-xs text-orange-600 font-semibold">Only {product.quantity} left</span>
                              ) : (
                                <span className="text-xs text-green-600 font-semibold">In Stock</span>
                              )}
                            </div>
                            <div className="text-left mt-5">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                ₹{product.price?.toLocaleString()}
                              </div>
                              {product.mrp && product.mrp > product.price && (
                                <div className="flex gap-1">
                                  <div className="text-sm text-gray-500 line-through font-medium mb-1">
                                    ₹{product.mrp.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-green-600 font-medium mb-2">
                                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Products in this category are currently unavailable.
                    </p>
                    <Button
                      onClick={() => handleCategorySelect(null)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Browse All Categories
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Shop by Category
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover premium electronics and technology products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
