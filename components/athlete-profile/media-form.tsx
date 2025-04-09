"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, X, Plus, Video } from "lucide-react"
import Image from "next/image"

type MediaFormProps = {
  data: {
    photoURL: string
    galleryImages: string[]
    videoLinks: string[]
  }
  updateData: (data: Partial<MediaFormProps["data"]>) => void
}

export function MediaForm({ data, updateData }: MediaFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newVideoLink, setNewVideoLink] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // In a real app, this would upload to storage
  // For now, we'll just use a placeholder or file reader
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, upload to Firebase Storage
      // For now, create a local URL
      const reader = new FileReader()
      reader.onload = () => {
        updateData({ photoURL: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // In a real app, upload to Firebase Storage
      // For now, create local URLs
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          updateData({
            galleryImages: [...data.galleryImages, reader.result as string],
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeGalleryImage = (index: number) => {
    const updatedImages = [...data.galleryImages]
    updatedImages.splice(index, 1)
    updateData({ galleryImages: updatedImages })
  }

  const addVideoLink = () => {
    if (newVideoLink.trim()) {
      updateData({ videoLinks: [...data.videoLinks, newVideoLink.trim()] })
      setNewVideoLink("")
    }
  }

  const removeVideoLink = (index: number) => {
    const updatedLinks = [...data.videoLinks]
    updatedLinks.splice(index, 1)
    updateData({ videoLinks: updatedLinks })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Media & Gallery</h2>
        <p className="text-gray-600 mb-6">Add photos and videos to showcase your athletic abilities.</p>
      </div>

      <div className="space-y-4">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            {data.photoURL ? (
              <Image src={data.photoURL || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No photo</span>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePhotoChange}
              accept="image/*"
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-1">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
            <p className="text-xs text-gray-500">Recommended: Square image, at least 400x400px</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Action Photos</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.galleryImages.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
              <Image src={image || "/placeholder.svg"} alt={`Gallery ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <div
            className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => document.getElementById("gallery-upload")?.click()}
          >
            <Plus className="h-8 w-8 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Add Image</span>
            <input
              id="gallery-upload"
              type="file"
              onChange={handleGalleryImageUpload}
              accept="image/*"
              className="hidden"
              multiple
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">Add photos of yourself in action, competitions, or training</p>
      </div>

      <div className="space-y-4">
        <Label>Highlight Videos</Label>
        <div className="flex gap-2">
          <Input
            value={newVideoLink}
            onChange={(e) => setNewVideoLink(e.target.value)}
            placeholder="YouTube or Vimeo URL"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addVideoLink()
              }
            }}
          />
          <Button type="button" onClick={addVideoLink} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.videoLinks.length > 0 ? (
          <div className="space-y-2 mt-3">
            {data.videoLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <Video className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm truncate max-w-[250px] sm:max-w-md">{link}</span>
                </div>
                <button onClick={() => removeVideoLink(index)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            No videos added yet. Add links to your highlight videos to showcase your skills.
          </p>
        )}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          High-quality photos and videos help trainers assess your skills and technique before your first session.
        </AlertDescription>
      </Alert>
    </div>
  )
}
