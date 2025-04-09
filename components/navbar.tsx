"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ChevronDown, Menu, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/firebase-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

  useEffect(() => {
    // Log user data for debugging
    console.log("Navbar - User data:", user)
    console.log("Navbar - User photoURL:", user?.photoURL)

    if (user?.photoURL) {
      setProfileImageUrl(user.photoURL)
    } else {
      setProfileImageUrl(null)
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="border-b border-gray-800 bg-[#121212]">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/x1-sports-silver-logo.png"
              alt="X:1 Sports Logo"
              width={150}
              height={50}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Athletes <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
              <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Find Training</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">My Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">My Bookings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Trainers <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
              <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Become a Trainer</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Trainer Dashboard</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Manage Sessions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/ncaa-coach-registration" className="text-sm font-medium text-gray-300 hover:text-white">
            NCAA Coach Registration
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Avatar className="h-8 w-8">
                    {profileImageUrl ? (
                      <AvatarImage
                        src={profileImageUrl}
                        alt={user?.displayName || "User"}
                        className="object-cover"
                        onError={() => {
                          console.error("Error loading profile image in navbar:", profileImageUrl)
                          setProfileImageUrl(null)
                        }}
                      />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.displayName || user.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800" asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>

                {/* Admin Dashboard Link - Only visible to admins */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 text-blue-400" asChild>
                      <Link href="/admin">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-gray-800 focus:bg-gray-800">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign In <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="hover:bg-gray-800 focus:bg-gray-800">
                    Create Account
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-gray-900 border-gray-700">
                      <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800" asChild>
                        <Link href="/sign-up?role=athlete">As Athlete</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800" asChild>
                        <Link href="/sign-up?role=trainer">As Trainer</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800" asChild>
                        <Link href="/sign-up?role=coach">As Coach</Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Help</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container px-4 py-4 md:hidden border-t border-gray-800 bg-[#121212]">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/athletes"
              className="flex items-center justify-between py-2 text-sm font-medium border-b border-gray-800 text-gray-300 hover:text-white"
            >
              Athletes
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link
              href="/trainers"
              className="flex items-center justify-between py-2 text-sm font-medium border-b border-gray-800 text-gray-300 hover:text-white"
            >
              Trainers
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link
              href="/ncaa-coach-registration"
              className="flex items-center justify-between py-2 text-sm font-medium border-b border-gray-800 text-gray-300 hover:text-white"
            >
              NCAA Coach Registration
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="text-sm font-medium text-gray-300 hover:text-white">
                  Profile
                </Link>

                {/* Admin Dashboard Link in mobile menu - Only visible to admins */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                )}

                <button onClick={handleSignOut} className="text-sm font-medium text-red-400 text-left">
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/sign-in"
                  className="flex items-center justify-between py-2 text-sm font-medium border-b border-gray-800 text-gray-300 hover:text-white"
                >
                  Sign In
                </Link>
                <div className="py-2 text-sm font-medium border-b border-gray-800 text-gray-300">Create Account:</div>
                <Link
                  href="/sign-up?role=athlete"
                  className="flex items-center py-2 pl-4 text-sm font-medium border-b border-gray-800 text-blue-400 hover:text-blue-300"
                >
                  As Athlete
                </Link>
                <Link
                  href="/sign-up?role=trainer"
                  className="flex items-center py-2 pl-4 text-sm font-medium border-b border-gray-800 text-red-400 hover:text-red-300"
                >
                  As Trainer
                </Link>
                <Link
                  href="/sign-up?role=coach"
                  className="flex items-center py-2 pl-4 text-sm font-medium border-b border-gray-800 text-purple-400 hover:text-purple-300"
                >
                  As Coach
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
