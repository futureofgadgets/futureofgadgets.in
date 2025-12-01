"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [contactSettings, setContactSettings] = useState({
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.contact) setContactSettings(data.contact);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (pathname === '/' && !loading) {
      const hasSeenText = sessionStorage.getItem('whatsappTextSeen');
      if (!hasSeenText) {
        setShowText(true);
      }
    }
  }, [pathname, loading]);

  const handleWhatsAppClick = () => {
    if (!loading && contactSettings.phone) {
      const cleanPhone = contactSettings.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  if (pathname.startsWith('/admin')) return null;

  if (loading) {
    return (
      <div className="fixed bottom-16 right-4 md:bottom-6 md:right-6 z-50">
        <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!contactSettings.phone) return null;

  return (
    <div className="fixed bottom-16 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-2">
      {(showText || isClosing) && (
        <div className={isClosing ? 'animate-slideDown' : 'animate-slideUp'}>
        <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl shadow-2xl p-4 max-w-xs relative">
          <button
            onClick={() => {
              setIsClosing(true);
              sessionStorage.setItem('whatsappTextSeen', 'true');
              setTimeout(() => {
                setShowText(false);
                setIsClosing(false);
              }, 300);
            }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors border border-gray-200 hover:cursor-pointer"
            aria-label="Close"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
          <p className="text-sm font-semibold text-gray-800 mb-1">Have any questions?</p>
          <p className="text-xs text-gray-600">Chat with us on WhatsApp for instant support!</p>
        </div>
        </div>
      )}
      <div className="relative">
        {/* <div className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-75"></div> */}
        <button
          onClick={handleWhatsAppClick}
          className="relative bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:cursor-pointer"
          aria-label="Contact us on WhatsApp"
        >
          <img 
            src="/WhatsApp.svg" 
            alt="WhatsApp" 
            className="w-10 h-10" 
          />
        </button>
      </div>
    </div>
  );
}
