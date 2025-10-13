import React from "react";
import Link from "next/link";
import Image from "next/image";
// search?q=laptops
const brands = [
  { name: "Apple", image: "/brand/Apple.png",},
  { name: "Asus", image: "/brand/Asus.png" },
  { name: "Dell", image: "/brand/dell.png" },
  { name: "HP", image: "/brand/hp.webp" },
  { name: "Lenovo", image: "/brand/lenovo.png" },
  { name: "Samsung", image: "/brand/samsung.png" },
  { name: "Sony", image: "/brand/acer.png" },
];





const ShopByBrands = () => {
  return (
     <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="border border-[#c1e5cf] dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white pb-2 sm:pb-3 border-b border-[#c1e5cf] dark:border-gray-700">Shop By Brands</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {brands.map((brand) => (
            <a
              key={brand.name}
              href={`/search?q=${brand.name.toLowerCase()}`}
              className="bg-gray-50 dark:bg-gray-800 w-full h-16 sm:h-20 flex items-center justify-center rounded-lg overflow-hidden hover:shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={100}
                height={70}
                className="w-12 h-9 sm:w-16 sm:h-12 object-contain transition-all duration-300"
              />
            </a>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByBrands;
