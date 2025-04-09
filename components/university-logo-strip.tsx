export function UniversityLogoStrip() {
  return (
    <div className="flex justify-center gap-6 mt-8">
      {/* Washington State Logo */}
      <div className="bg-black p-3 rounded-lg">
        <img src="/images/logos/wsu-logo.png" alt="Washington State University" className="h-16 w-auto" />
      </div>

      {/* Duke University Logo */}
      <div className="bg-black p-3 rounded-lg">
        <img src="/images/logos/duke-university-logo.png" alt="Duke University" className="h-16 w-auto" />
      </div>
    </div>
  )
}
