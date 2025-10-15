"use client";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Search,
  User,
  Home,
  Settings,
  UserSquare,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  // { href: "/admin/dashboard", icon: BarChart3, label: "Admin Panel" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/settings", icon: SettingsIcon, label: "Settings" },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="min-h-screen flex">
        {/* Sidebar for md+ */}
        <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50 bg-white border-r">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="Store logo" className="h-10 w-10 rounded" />
                <div>
                  <h1 className="text-base font-bold text-gray-900">Future Of Gadgets</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Button variant="ghost" className="relative p-0 h-10 w-10 rounded-full">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                          </span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    {session && (
                      <>
                        <div className="p-2">
                          <p className="font-medium text-sm">{session.user?.name || "Admin"}</p>
                          <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/">Main Site</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-black truncate">{session?.user?.name || "Admin"}</div>
                  <div className="text-xs text-gray-600 truncate">{session?.user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <header className="fixed top-0 left-0 right-0 md:left-64 z-40 flex h-16 items-center justify-between gap-2 sm:gap-4 border-b bg-white px-2 sm:px-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Store logo" className="h-8 w-8 rounded" />
                <div>
                  <h1 className="text-sm font-bold text-gray-900">Future Of Gadgets</h1>
                  <p className="text-[10px] text-gray-500">Admin Panel</p>
                </div>
              </Link>
            </div>
            <div className="hidden md:block text-lg font-semibold text-gray-900">Admin Dashboard</div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer flex-shrink-0">
                <Button
                  variant="ghost"
                  className="relative p-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-transparent hover:border-blue-200 transition-all duration-200"
                >
                  {status === "loading" ? (
                    <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    </div>
                  ) : session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {session && (
                  <>
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">
                        {session.user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/">Main Site</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="pt-16 pb-16 md:pb-0">{children}</div>
        </div>
        
        {/* Bottom Nav for Mobile */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
          <div className="flex justify-around items-center h-14">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 h-full ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
