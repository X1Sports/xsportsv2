"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, limit, doc, updateDoc } from "firebase/firestore"
import { CheckCircle, Eye, Search, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function ContentReviewPage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [contentType, setContentType] = useState("all")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedContent, setSelectedContent] = useState<any | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchContent = async (reset = false) => {
    try {
      setLoading(true)

      if (reset) {
        setPage(1)
      }

      // Determine which collection to query based on content type
      let collectionName = "products" // Default to products
      if (contentType === "programs") {
        collectionName = "programs"
      } else if (contentType === "media") {
        collectionName = "media"
      }

      const contentRef = collection(db, collectionName)

      // Create a basic query without any ordering
      let q = query(contentRef, limit(pageSize * page))

      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        q = query(contentRef, where("status", "==", statusFilter), limit(pageSize * page))
      }

      const querySnapshot = await getDocs(q)

      // Convert to array and sort manually
      let fetchedContent = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Sort by createdAt manually (client-side)
      fetchedContent.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0)
        return dateB.getTime() - dateA.getTime() // Descending order
      })

      // Limit to the current page
      fetchedContent = fetchedContent.slice(0, pageSize * page)

      // Check if we have more results
      setHasMore(querySnapshot.size >= pageSize * page)

      setContent(fetchedContent)
    } catch (error) {
      console.error("Error fetching content:", error)
      toast({
        title: "Error",
        description: "Failed to fetch content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent(true)
  }, [contentType, statusFilter])

  const handleLoadMore = () => {
    setPage(page + 1)
    fetchContent(false)
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchContent(true)
      return
    }

    const searchTermLower = searchTerm.toLowerCase()
    const filteredContent = content.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTermLower) ||
        item.description?.toLowerCase().includes(searchTermLower) ||
        item.createdBy?.name?.toLowerCase().includes(searchTermLower),
    )

    setContent(filteredContent)
    setHasMore(false)
  }

  const handleReviewContent = async (approved: boolean) => {
    if (!selectedContent) return

    try {
      // Determine which collection to update based on content type
      let contentRef
      if (selectedContent.type === "product") {
        contentRef = doc(db, "products", selectedContent.id)
      } else if (selectedContent.type === "program") {
        contentRef = doc(db, "programs", selectedContent.id)
      } else if (selectedContent.type === "media") {
        contentRef = doc(db, "media", selectedContent.id)
      } else {
        throw new Error("Unknown content type")
      }

      await updateDoc(contentRef, {
        status: approved ? "approved" : "rejected",
        reviewNotes: reviewNotes,
        reviewedAt: new Date(),
        reviewedBy: {
          id: "admin", // In a real app, use the actual admin ID
          name: "Administrator", // In a real app, use the actual admin name
        },
        updatedAt: new Date(),
      })

      // Update the content in the local state
      setContent(
        content.map((item) =>
          item.id === selectedContent.id
            ? {
                ...item,
                status: approved ? "approved" : "rejected",
                reviewNotes,
                reviewedAt: new Date(),
              }
            : item,
        ),
      )

      toast({
        title: approved ? "Content approved" : "Content rejected",
        description: approved
          ? "Content has been approved and is now visible to users."
          : "Content has been rejected and will not be visible to users.",
      })

      setIsReviewDialogOpen(false)
      setSelectedContent(null)
      setReviewNotes("")
    } catch (error) {
      console.error("Error updating content status:", error)
      toast({
        title: "Error",
        description: "Failed to update content status.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      )
    }

    if (status === "rejected") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800 border-red-300">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-300">
        <Eye className="h-3 w-3" />
        Pending Review
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Review</h1>
          <p className="text-muted-foreground">Review and approve trainer content before it goes live.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                All Content
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                Pending Review
              </TabsTrigger>
              <TabsTrigger value="approved" onClick={() => setStatusFilter("approved")}>
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" onClick={() => setStatusFilter("rejected")}>
                Rejected
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <Select value={contentType} onValueChange={(value) => setContentType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="programs">Programs</SelectItem>
                <SelectItem value="media">Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && content.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : content.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No content found.
                    </TableCell>
                  </TableRow>
                ) : (
                  content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title || "Untitled"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>{item.createdBy?.name || "Unknown"}</TableCell>
                      <TableCell>
                        {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : "Unknown"}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedContent(item)
                            setIsReviewDialogOpen(true)
                          }}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Content</DialogTitle>
            <DialogDescription>Review this content before approving or rejecting it.</DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <>
              <div className="py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedContent.title || "Untitled"}</h3>

                    {selectedContent.imageUrl && (
                      <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                        <Image
                          src={selectedContent.imageUrl || "/placeholder.svg"}
                          alt={selectedContent.title || "Content image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p>
                        <strong>Type:</strong> {selectedContent.type || "Unknown"}
                      </p>
                      <p>
                        <strong>Submitted by:</strong> {selectedContent.createdBy?.name || "Unknown"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {selectedContent.createdAt?.toDate
                          ? new Date(selectedContent.createdAt.toDate()).toLocaleDateString()
                          : "Unknown"}
                      </p>
                      {selectedContent.price && (
                        <p>
                          <strong>Price:</strong> ${selectedContent.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedContent.description || "No description provided."}
                    </p>

                    {selectedContent.details && (
                      <>
                        <h4 className="font-medium mb-2">Details</h4>
                        <p className="text-sm text-gray-600">{selectedContent.details}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md text-black"
                    rows={3}
                    placeholder="Add notes about this review decision..."
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="destructive" onClick={() => handleReviewContent(false)}>
                  Reject Content
                </Button>
                <Button variant="default" onClick={() => handleReviewContent(true)}>
                  Approve Content
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
