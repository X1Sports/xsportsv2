import Link from "next/link"
import {
  LucideInstagram,
  LucideTwitter,
  LucideFacebook,
  LucideUser,
  LucideDumbbell,
  LucideClipboard,
  LucideMail,
  LucideShield,
  LucideFileText,
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] border-t border-blue-900/30 mt-16 relative">
      {/* Subtle glow effect at the top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-6 text-white/90 flex items-center gap-2">
              <span className="bg-blue-900/20 p-1.5 rounded-md">
                <LucideUser size={18} className="text-blue-400" />
              </span>
              Join Our Network
            </h3>
            <div className="space-y-4">
              <Link
                href="/sign-up?role=athlete"
                className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-all px-4 py-2.5 rounded-lg hover:bg-blue-900/10 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center border border-blue-500/30 group-hover:border-blue-500/50 transition-colors">
                  <LucideUser size={18} className="text-blue-400" />
                </div>
                <span>Sign up as Athlete</span>
              </Link>

              <Link
                href="/sign-up?role=trainer"
                className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-all px-4 py-2.5 rounded-lg hover:bg-red-900/10 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center border border-red-500/30 group-hover:border-red-500/50 transition-colors">
                  <LucideDumbbell size={18} className="text-red-400" />
                </div>
                <span>Sign up as Trainer</span>
              </Link>

              <Link
                href="/sign-up?role=coach"
                className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-all px-4 py-2.5 rounded-lg hover:bg-purple-900/10 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center border border-purple-500/30 group-hover:border-purple-500/50 transition-colors">
                  <LucideClipboard size={18} className="text-purple-400" />
                </div>
                <span>Sign up as Coach</span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-6 text-white/90 flex items-center gap-2">
              <span className="bg-blue-900/20 p-1.5 rounded-md">
                <LucideMail size={18} className="text-blue-400" />
              </span>
              Contact Us
            </h3>
            <a
              href="mailto:info@myx1sports.com"
              className="text-gray-400 hover:text-blue-400 transition-colors mb-6 border border-blue-900/30 rounded-full px-5 py-2.5 hover:border-blue-500/50 bg-[#0c0c14]/50 flex items-center gap-2"
            >
              <LucideMail size={16} />
              info@myx1sports.com
            </a>
            <div className="flex space-x-5 mt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#0c0c14] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
              >
                <LucideInstagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#0c0c14] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
              >
                <LucideTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#0c0c14] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
              >
                <LucideFacebook size={18} />
              </a>
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold mb-6 text-white/90 flex items-center gap-2">
              <span className="bg-blue-900/20 p-1.5 rounded-md">
                <LucideShield size={18} className="text-blue-400" />
              </span>
              About X1 Sports
            </h3>
            <p className="text-gray-400 text-center md:text-right mb-4">
              The premier platform for sports networking and skill development
            </p>
            <Link
              href="/about"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1"
            >
              Learn more about our mission
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="pt-6 mt-6 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© {currentYear} X1 Sports. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1.5 cursor-pointer"
              prefetch={false}
            >
              <LucideShield size={14} />
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1.5 cursor-pointer"
              prefetch={false}
            >
              <LucideFileText size={14} />
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
