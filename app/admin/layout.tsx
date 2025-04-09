"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminGuard } from "@/components/auth/admin-guard"
import { BarChart3, CreditCard, LayoutDashboard, Menu, Settings, Users, FileCheck } from "lucide-react"
import { useState } from "react"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: React.ReactNode
    variant: "default" | "ghost"
    href: string
  }[]
}

function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()

  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === link.href ? "bg-accent text-accent-foreground" : "transparent",
              isCollapsed && "justify-center",
            )}
          >
            {link.icon}
            {!isCollapsed && <span>{link.title}</span>}
            {!isCollapsed && link.label && <span className="ml-auto text-xs text-muted-foreground">{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const links = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      variant: "default",
      href: "/admin",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      variant: "ghost",
      href: "/admin/analytics",
    },
    {
      title: "Users",
      icon: <Users className="h-4 w-4" />,
      variant: "ghost",
      href: "/admin/users",
    },
    {
      title: "Content Review",
      icon: <FileCheck className="h-4 w-4" />,
      variant: "ghost",
      href: "/admin/content-review",
    },
    {
      title: "Billing",
      icon: <CreditCard className="h-4 w-4" />,
      variant: "ghost",
      href: "/admin/billing",
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      variant: "ghost",
      href: "/admin/settings",
    },
  ]

  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 md:px-8">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="px-7">
                  <Link href="/" className="flex items-center" onClick={() => setIsMobileOpen(false)}>
                    <span className="font-bold">X1:Sports Admin</span>
                  </Link>
                </div>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                  <div className="pl-6 pr-8">
                    <Nav isCollapsed={false} links={links} />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 md:ml-auto md:gap-4">
              <Link href="/" className="flex items-center gap-2 font-semibold md:hidden">
                X1:Sports Admin
              </Link>
              <div className="ml-auto flex items-center space-x-4">
                <Link href="/" className="text-sm font-medium">
                  Return to Site
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  X1:Sports Admin
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto h-8 w-8"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </div>
              <Nav isCollapsed={isCollapsed} links={links} />
            </div>
          </div>
          <div className="flex-1 p-8 pt-6">{children}</div>
        </div>
      </div>
    </AdminGuard>
  )
}
