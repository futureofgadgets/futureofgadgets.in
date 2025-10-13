"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { toast as sonnerToast } from "sonner";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { Flame, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discounted = product.mrp && product.mrp > product.price;

  return (
    <div className="border sm:rounded-lg border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative group overflow-hidden bg-gray-50">
        <Link href={`/products/${product.slug}`} className="block">
          <CloudinaryImage
            src={product.frontImage || product.image || "/no-image.svg"}
            alt={product.name}
            width={500}
            height={500}
            className={`w-full h-48 aspect-square object-cover transition-transform duration-500 ${product.quantity !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
          />
        </Link>
       {discounted && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-orange-500 text-white px-1.5 py-0.5 sm:px-2 rounded-full text-[9px] sm:text-xs font-semibold z-10">
            {Math.round(((product.mrp! - product.price) / product.mrp!) * 100)}% OFF
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-red-500"
            } stroke-2`}
          />
        </button>
        
      </div>
      <div className="p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
        <p className="uppercase line-clamp-1 text-[10px] sm:text-xs font-medium text-gray-500">
          {product.category}
        </p>
        <h3 className="text-xs sm:text-sm line-clamp-2 font-semibold min-h-[2.5rem] sm:min-h-0">{product.name}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < 4 ? "text-green-500" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-500 text-[9px] sm:text-xs">5 Reviews</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <p className="font-medium">In Stock</p>
          <p className={`${product.quantity === 0 ? "text-red-600" : "text-green-700 font-semibold"}`}>
            {product.quantity > 0 ? product.quantity : "unavailable"}
          </p>
        </div>
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-sm sm:text-lg font-bold">₹{product.price.toLocaleString()}</span>
          {discounted && product.mrp && (
            <span className="text-[10px] sm:text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
          )}
        </div>
        <Button
          onClick={() => {
            addToCart({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.frontImage || product.image,
            });
            sonnerToast.success("Added to cart", {
              description: product.name,
            });
          }}
          disabled={product.quantity <= 0}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] sm:text-sm font-semibold py-2 sm:py-2.5 rounded-md flex items-center justify-center gap-1 sm:gap-1.5 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add to Cart</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
}

