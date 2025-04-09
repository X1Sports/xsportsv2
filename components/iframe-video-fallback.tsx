export function IframeVideoFallback() {
  return (
    <iframe
      src="/direct-video.html"
      className="absolute inset-0 w-full h-full border-0"
      title="Background Video"
      allow="autoplay"
    />
  )
}
