import React from 'react'
import ProductCard from '../product-card'
import { popularProducts } from "@/lib/data/popular-products";
import Link from 'next/link';

export default function NewArrivals(){
    return (
        <section className="py-6 sm:py-10">
        <div className="mx-auto max-w-[1440px]  sm:px-6 lg:px-11">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-0">
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Fresh products just in</p>
            </div>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0 sm:gap-4">
            {popularProducts.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    )
}
