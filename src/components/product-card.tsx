"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";

export default function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();
  const discounted = product.mrp && product.mrp > product.price;
  const discountPct =
    discounted && product.mrp
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="bg-white p-2 sm:p-3 md:p-4">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden mb-2 sm:mb-3 md:mb-4">
        <CloudinaryImage
          src={product.frontImage || product.image || "/no-image.svg"}
          alt={`${product.name} image`}
          width={500}
          height={300}
          className="h-32 sm:h-40 md:h-48 w-full object-contain transition-transform duration-300 hover:scale-110"
        />
      </Link>
      <Link href={`/products/${product.slug}`} className="block">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2 mb-1">
          {product.name}
        </h3>
      </Link>
      <div className="text-xs text-gray-500 mb-2 sm:mb-3">{product.brand}</div>
      <div className="mb-2 sm:mb-3">
        <div className="flex items-baseline gap-1 sm:gap-2 mb-1 flex-wrap">
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            ₹{product.price.toFixed(2)}
          </span>
          {discounted && (
            <>
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{product.mrp?.toFixed(2)}
              </span>
              <span className="text-xs sm:text-sm text-green-600 font-medium">
                {discountPct}% off
              </span>
            </>
          )}
        </div>
        <span className={product.quantity <= 5 ? "text-xs text-amber-600" : "text-xs text-gray-500"}>
          {product.quantity <= 5 ? "Low stock" : "In stock"}
        </span>
      </div>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm py-1.5 sm:py-2"
        onClick={() => {
          addToCart({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.frontImage || product.image,
          });
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          });
        }}
        disabled={product.quantity <= 0}
      >
        Add to Cart
      </Button>
    </div>
  );
}
