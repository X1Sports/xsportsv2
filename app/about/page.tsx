import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Athletes training"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/50 to-[#121212]"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Our Mission
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing sports training by connecting athletes, trainers, and coaches on one powerful platform
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/10 to-[#121212] p-8 rounded-xl border border-blue-900/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Why We Built X1 Sports</h2>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              At X1 Sports, we believe that exceptional athletic performance comes from the right connections. We've
              created a platform where athletes can find their perfect trainers, trainers can showcase their expertise,
              and coaches can discover promising talent—all in one seamless ecosystem.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our mission is to democratize access to quality sports training and create opportunities for athletes at
              all levels to reach their full potential through technology and community.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do - Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">What We Do</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-[#0c0c14] to-[#0a0a0a] rounded-xl overflow-hidden border border-blue-900/20 group hover:border-blue-500/30 transition-all duration-300">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Athletes connecting with trainers"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Connect</h3>
                <p className="text-gray-400 mb-4">
                  We bring athletes, trainers, and coaches together on one platform, making it easy to find the perfect
                  match for your sports journey.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-[#0c0c14] to-[#0a0a0a] rounded-xl overflow-hidden border border-blue-900/20 group hover:border-blue-500/30 transition-all duration-300">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Training session"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" x2="6" y1="1" y2="4"></line>
                    <line x1="10" x2="10" y1="1" y2="4"></line>
                    <line x1="14" x2="14" y1="1" y2="4"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Train</h3>
                <p className="text-gray-400 mb-4">
                  Book and purchase training sessions with top-tier trainers specializing in your sport, all through our
                  seamless platform.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-[#0c0c14] to-[#0a0a0a] rounded-xl overflow-hidden border border-blue-900/20 group hover:border-blue-500/30 transition-all duration-300">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Athlete growth"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Grow</h3>
                <p className="text-gray-400 mb-4">
                  Track your progress, showcase your skills, and get discovered by coaches looking for talent in your
                  sport.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Each User Type */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">For Everyone in Sports</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Athletes */}
            <div className="bg-gradient-to-br from-blue-900/10 to-[#0c0c14] p-8 rounded-xl border border-blue-900/20">
              <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-white">For Athletes</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Find trainers specialized in your sport
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Book training sessions that fit your schedule
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Track your progress and showcase your skills
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Get discovered by coaches and recruiters
                </li>
              </ul>
              <div className="text-center">
                <Link href="/sign-up?role=athlete">
                  <Button className="bg-blue-600 hover:bg-blue-700">Join as Athlete</Button>
                </Link>
              </div>
            </div>

            {/* Trainers */}
            <div className="bg-gradient-to-br from-red-900/10 to-[#0c0c14] p-8 rounded-xl border border-red-900/20">
              <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-400"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" x2="6" y1="1" y2="4"></line>
                  <line x1="10" x2="10" y1="1" y2="4"></line>
                  <line x1="14" x2="14" y1="1" y2="4"></line>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-white">For Trainers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Showcase your expertise and credentials
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Offer individual and group training sessions
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Manage your schedule and bookings
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Build your reputation with reviews and ratings
                </li>
              </ul>
              <div className="text-center">
                <Link href="/sign-up?role=trainer">
                  <Button className="bg-red-600 hover:bg-red-700">Join as Trainer</Button>
                </Link>
              </div>
            </div>

            {/* Coaches */}
            <div className="bg-gradient-to-br from-purple-900/10 to-[#0c0c14] p-8 rounded-xl border border-purple-900/20">
              <div className="w-16 h-16 rounded-full bg-purple-900/20 flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-400"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                  <path d="m9 16 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-white">For Coaches</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Discover promising athletes for your team
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Review athlete profiles and performance data
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Connect with trainers for collaborative coaching
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400 mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Streamline your recruitment process
                </li>
              </ul>
              <div className="text-center">
                <Link href="/sign-up?role=coach">
                  <Button className="bg-purple-600 hover:bg-purple-700">Join as Coach</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-900/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#121212] to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Sports Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join X1 Sports today and connect with the people who will take your game to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">Join X1 Sports</Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/20 text-lg px-8 py-6"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
