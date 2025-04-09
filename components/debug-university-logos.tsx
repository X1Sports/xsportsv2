export function DebugUniversityLogos() {
  return (
    <div className="p-4 bg-black rounded-lg">
      <h3 className="text-white mb-4">Logo Debug</h3>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-white mb-2">Washington State Logo:</p>
          <img src="/images/logos/wsu-logo.png" alt="Washington State" className="h-16 w-auto border border-white" />
        </div>

        <div>
          <p className="text-white mb-2">Duke Logo (Direct URL):</p>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%283%29-Bc2RXZBS99cpWFvbGSyxXC7AKgWPxj.png"
            alt="Duke University"
            className="h-16 w-auto border border-white"
          />
        </div>

        <div>
          <p className="text-white mb-2">Duke Logo (Local Path):</p>
          <img src="/images/logos/duke-logo.png" alt="Duke University" className="h-16 w-auto border border-white" />
        </div>
      </div>
    </div>
  )
}
