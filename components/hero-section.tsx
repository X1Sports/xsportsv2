import { AnimatedCatchphrase } from "./animated-catchphrase"
import { SearchTrainers } from "./search-trainers"
import { HeroVideo } from "./hero-video"
import { DukeLogo } from "./duke-logo"

export function HeroSection() {
  return (
    <section className="relative w-full h-[800px] overflow-hidden hero-section">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <HeroVideo />
      </div>

      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80 z-10" />

      <div className="container relative z-20 flex flex-col items-center justify-center h-full px-4 mx-auto text-center text-white">
        <AnimatedCatchphrase />

        <div className="w-full max-w-5xl mt-12 relative">
          <SearchTrainers />

          {/* University Logos */}
          <div className="mt-8 flex justify-center space-x-6">
            {/* Washington State Logo */}
            <div className="bg-black p-3 rounded-lg">
              <img src="/images/logos/wsu-logo.png" alt="Washington State University" className="h-16 w-auto" />
            </div>

            {/* Duke Logo Component */}
            <DukeLogo />
          </div>
        </div>
      </div>
    </section>
  )
}
