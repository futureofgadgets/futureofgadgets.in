import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company and mission",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Electronic Web</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Electronic Web is your trusted destination for quality electronics and gadgets. 
            We are committed to providing the latest technology products at competitive prices 
            with exceptional customer service.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Founded with a vision to make technology accessible to everyone, we carefully 
            curate our product selection to ensure quality and value for our customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To provide cutting-edge electronics with unmatched quality and customer satisfaction.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Promise</h3>
            <p className="text-gray-600">
              Every product is tested and verified to meet our high standards before shipping.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and secure shipping to get your products to you as fast as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}