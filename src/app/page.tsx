"use client";

import HeaderSlider from "@/components/home/HomeSlider";
import { Footer } from "@/components/Footer";
import ShopByBrands from "@/components/home/ShopByBrands";
import PopularCategories from "@/components/home/PopularCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import BestSeller from "@/components/home/BestSeller";
import TrendingNow from "@/components/home/TrendingNow";
import DealoftheDay from "@/components/home/DealoftheDay";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedSection from "@/components/home/FeaturedSection";

export default function HomePage() {
  return (
     <main className="min-h-screen bg-gray-50/5 dark:bg-gray-900">
      {/* Hero Slider */}
      <section className="bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-[1400px] sm:px-6">
          <HeaderSlider />
        </div>
      </section>
      <div className="space-y-4 sm:space-y-8">
        <NewArrivals />
        <DealoftheDay />
        <FeaturedProducts />
        <PopularCategories />
        <PromotionalBanner />
        <BestSeller />
        <ShopByBrands />
        <TrendingNow />
        <FeaturedSection/>
      </div>
      <Footer />
    </main>
  );
}
