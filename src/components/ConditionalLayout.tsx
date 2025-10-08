'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Admin routes don't need navbar or padding
  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }
  
  // Regular routes get navbar and padding
  return (
    <>
      <Navbar />
      <div className="pt-23 md:pt-14">
        {children}
      </div>
    </>
  )
}