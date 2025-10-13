import React from "react";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";

export default function FeaturedSection() {
  const extraData = [
    {
      title: "Free Delivery",
      description: "Free shipping over $100",
      icon: <Truck className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
    {
      title: "Free Return",
      description: "30-day return policy",
      icon: <GitCompareArrows className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
    {
      title: "Customer Support",
      description: "Friendly 24/7 customer support",
      icon: <Headset className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
    {
      title: "Money Back Guarantee",
      description: "Quality checked by our team",
      icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
  ];

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {extraData?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center sm:text-left"
            >
              <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                {item?.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                  {item?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                  {item?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
