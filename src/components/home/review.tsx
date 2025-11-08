"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

const reviews = [
  "/review/SAVE_20251030_171105.jpg",
  "/review/SAVE_20251030_171112.jpg",
  "/review/SAVE_20251030_171119.jpg",
  "/review/SAVE_20251030_171126.jpg",
  "/review/SAVE_20251030_171138.jpg",
  "/review/SAVE_20251030_171152.jpg",
  "/review/SAVE_20251030_171159.jpg",
  "/review/SAVE_20251030_171207.jpg",
  "/review/SAVE_20251030_171216.jpg",
  "/review/SAVE_20251030_171224.jpg",
];

export default function Review() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const infiniteReviews = [...reviews, ...reviews, ...reviews];
  const [centerIndex, setCenterIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getItemWidth = () => (isMobile ? 240 + 16 : 350 + 24);

  const startAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: getItemWidth(), behavior: "smooth" });
      }
    }, 2000);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, clientWidth } = container;
      const itemWidth = getItemWidth();
      const singleSetWidth = reviews.length * itemWidth;
      const center = scrollLeft + clientWidth / 2;
      const index = Math.floor(center / itemWidth) % reviews.length;
      setCenterIndex(index);

      if (scrollLeft >= singleSetWidth * 2) {
        container.scrollLeft = singleSetWidth;
      } else if (scrollLeft <= 0) {
        container.scrollLeft = singleSetWidth;
      }
    };

    container.addEventListener("scroll", handleScroll);
    container.scrollLeft = reviews.length * getItemWidth();
    startAutoScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      stopAutoScroll();
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    stopAutoScroll();
    if (scrollRef.current) {
      const itemWidth = getItemWidth();
      scrollRef.current.scrollBy({
        left: direction === "left" ? -itemWidth : itemWidth,
        behavior: "smooth",
      });
    }
    setTimeout(startAutoScroll, 3000);
  };

  const scrollToCenter = (index: number) => {
    stopAutoScroll();
    if (scrollRef.current) {
      const itemWidth = getItemWidth();
      const cardWidth = isMobile ? 240 : 350;
      const targetScroll = index * itemWidth - scrollRef.current.clientWidth / 2 + cardWidth / 2;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
    setTimeout(startAutoScroll, 3000);
  };

  return (
    <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
      <div className="mx-auto max-w-8xl px-3 sm:px-4 md:px-6 mb-4 sm:mb-6 md:mb-8">
        <div className="text-left leading-tight mb-4">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 leading-snug">
            Customer Reviews
          </h2>
          <span className="text-xs sm:text-sm text-gray-600 leading-none">
            Trusted by thousands
          </span>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 sm:py-6 md:py-8 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {infiniteReviews.map((review, i) => {
              const isCenter = i % reviews.length === centerIndex;
              return (
              <div
                key={i}
                onClick={() => scrollToCenter(i)}
                className={`flex-shrink-0 cursor-pointer group transition-all duration-500 ${
                  isCenter ? "w-[200px] sm:w-[260px] md:w-[360px]" : "w-[240px] sm:w-[280px] md:w-[350px]"
                }`}
              >
                <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ease-out hover:scale-105 border-2 sm:border-[3px] ${
                  isCenter ? "border-blue-500 scale-105" : "border-transparent"
                }`}>
                  <Image
                    src={review}
                    alt={`Review ${i + 1}`}
                    width={350}
                    height={500}
                    className="w-full h-[320px] sm:h-[400px] md:h-[500px] object-cover"
                    priority={i < 3}
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
                    <div className="flex gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold">Customer Review</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Verified Purchase</p>
                  </div>
                </div>
              </div>
            );
            })}
          </div>

          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
