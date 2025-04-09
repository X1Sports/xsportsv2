import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./video-only.css" // This should be last to override other styles
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { ChatBot } from "@/components/chat-bot"
import { AuthProvider } from "@/contexts/firebase-context"
import { LoadingAnimation } from "@/components/loading-animation"
import { Footer } from "@/components/footer"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "X:1 Sports - Connect Athletes & Trainers",
  description: "Find your perfect trainer or coach to take your athletic performance to the next level",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="video-priority" strategy="beforeInteractive">
          {`
           // This script runs before anything else to ensure video plays
           document.addEventListener('DOMContentLoaded', function() {
             function ensureVideoPlays() {
               var videos = document.querySelectorAll('video');
               videos.forEach(function(video) {
                 // Make video visible
                 video.style.display = 'block';
                 video.style.visibility = 'visible';
                 video.style.opacity = '1';
                 video.style.zIndex = '1';
                 
                 // Ensure parent containers don't have backgrounds
                 var parent = video.parentElement;
                 while (parent && parent.tagName !== 'BODY') {
                   parent.style.backgroundColor = 'transparent';
                   parent = parent.parentElement;
                 }
                 
                 // Try to play
                 if (video.paused) {
                   video.muted = true;
                   video.play().catch(function(e) {
                     console.log('Will retry video play');
                   });
                 }
               });
             }
             
             // Run immediately and frequently
             ensureVideoPlays();
             setTimeout(ensureVideoPlays, 100);
             setTimeout(ensureVideoPlays, 500);
             setTimeout(ensureVideoPlays, 1000);
             setTimeout(ensureVideoPlays, 2000);
             
             // Run periodically
             setInterval(ensureVideoPlays, 1000);
           });
         `}
        </Script>
        <Script id="fix-specific-logos" strategy="afterInteractive">
          {`
           (function() {
             function fixLogos() {
               var logoSelectors = ['harvard', 'washington-state', 'lsu', 'fsu', 'michigan', 'duke', 'ohio-state', 'penn', 'virginia'];
               logoSelectors.forEach(function(logo) {
                 var images = document.querySelectorAll('img[src*="' + logo + '"]');
                 images.forEach(function(img) {
                   // Skip if this is inside a video container
                   if (img.closest('div:has(> video)') || img.closest('section:first-of-type')) {
                     return;
                   }
                   
                   var parent = img.parentElement;
                   for (var i = 0; i < 3 && parent; i++) {
                     parent.style.backgroundColor = "#000000";
                     parent = parent.parentElement;
                   }
                 });
               });
             }
             
             // Run after a delay to ensure video plays first
             setTimeout(fixLogos, 2000);
             
             // Run periodically but less frequently
             setInterval(fixLogos, 5000);
           })();
         `}
        </Script>
      </head>
      <body className={`${inter.className} bg-[#121212] text-white`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
            <LoadingAnimation />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ChatBot />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'