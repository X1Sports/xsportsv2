"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  updateDoc,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { Edit, Search, Trash2, UserCog, Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react"
import Link from "next/link"
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

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editUser, setEditUser] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any | null>(null)
  const [userToSuspend, setUserToSuspend] = useState<any | null>(null)
  const [userToApprove, setUserToApprove] = useState<any | null>(null)
  const [suspensionReason, setSuspensionReason] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")

  const fetchUsers = async (reset = false) => {
    try {
      setLoading(true)
      const usersRef = collection(db, "users")

      // Start with a basic query
      let q = query(usersRef, orderBy("createdAt", "desc"), limit(10))

      // Apply role filter if selected
      if (roleFilter !== "all") {
        // We need to create a new query without the orderBy to avoid index issues
        q = query(usersRef, where("userRole", "==", roleFilter), limit(10))
      }

      // Apply status filter if selected
      if (statusFilter !== "all") {
        // We need to create a new query without the orderBy to avoid index issues
        q = query(usersRef, where("status", "==", statusFilter), limit(10))
      }

      // Apply both filters if both are selected
      if (roleFilter !== "all" && statusFilter !== "all") {
        q = query(usersRef, where("userRole", "==", roleFilter), where("status", "==", statusFilter), limit(10))
      }

      // Apply pagination if not resetting and we have a last document
      if (!reset && lastVisible) {
        q = query(q, startAfter(lastVisible))
      }

      const querySnapshot = await getDocs(q)

      // Check if we have more results
      setHasMore(querySnapshot.docs.length === 10)

      // Update the last visible document for pagination
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      setLastVisible(lastDoc || null)

      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // If resetting, replace users, otherwise append
      setUsers(reset ? fetchedUsers : [...users, ...fetchedUsers])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(true)
  }, [roleFilter, statusFilter])

  const handleSearch = () => {
    // For simplicity, we'll just filter the already loaded users
    // In a real app, you might want to implement server-side search
    if (!searchTerm.trim()) {
      fetchUsers(true)
      return
    }

    const searchTermLower = searchTerm.toLowerCase()
    const filteredUsers = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchTermLower) ||
        user.displayName?.toLowerCase().includes(searchTermLower),
    )

    setUsers(filteredUsers)
    setHasMore(false)
  }

  const handleRoleChange = async () => {
    if (!editUser) return

    try {
      const userRef = doc(db, "users", editUser.id)
      await updateDoc(userRef, {
        userRole: editUser.userRole,
        updatedAt: new Date(),
      })

      // Update the user in the local state
      setUsers(users.map((user) => (user.id === editUser.id ? { ...user, userRole: editUser.userRole } : user)))

      toast({
        title: "User updated",
        description: "User role has been updated successfully.",
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setLoading(true)

      // Call the API to delete the user from both Auth and Firestore
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userToDelete.id }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to delete user")
      }

      // Remove user from local state
      setUsers(users.filter((user) => user.id !== userToDelete.id))

      toast({
        title: "User deleted",
        description: "User has been completely deleted from Firebase Authentication and the database.",
      })

      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendUser = async () => {
    if (!userToSuspend) return

    try {
      const userRef = doc(db, "users", userToSuspend.id)
      await updateDoc(userRef, {
        status: "suspended",
        suspensionReason: suspensionReason,
        suspendedAt: new Date(),
        updatedAt: new Date(),
      })

      // Update the user in the local state
      setUsers(
        users.map((user) =>
          user.id === userToSuspend.id
            ? { ...user, status: "suspended", suspensionReason, suspendedAt: new Date() }
            : user,
        ),
      )

      toast({
        title: "User suspended",
        description: "User has been suspended successfully.",
      })

      setIsSuspendDialogOpen(false)
      setUserToSuspend(null)
      setSuspensionReason("")
    } catch (error) {
      console.error("Error suspending user:", error)
      toast({
        title: "Error",
        description: "Failed to suspend user.",
        variant: "destructive",
      })
    }
  }

  const handleReinstateUser = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        status: "active",
        suspensionReason: null,
        suspendedAt: null,
        updatedAt: new Date(),
      })

      // Update the user in the local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "active", suspensionReason: null, suspendedAt: null } : user,
        ),
      )

      toast({
        title: "User reinstated",
        description: "User has been reinstated successfully.",
      })
    } catch (error) {
      console.error("Error reinstating user:", error)
      toast({
        title: "Error",
        description: "Failed to reinstate user.",
        variant: "destructive",
      })
    }
  }

  const handleApproveTrainer = async (approve: boolean) => {
    if (!userToApprove) return

    try {
      const userRef = doc(db, "users", userToApprove.id)
      await updateDoc(userRef, {
        trainerStatus: approve ? "approved" : "rejected",
        approvalNotes: approvalNotes,
        approvedAt: approve ? new Date() : null,
        updatedAt: new Date(),
      })

      // Update the user in the local state
      setUsers(
        users.map((user) =>
          user.id === userToApprove.id
            ? {
                ...user,
                trainerStatus: approve ? "approved" : "rejected",
                approvalNotes,
                approvedAt: approve ? new Date() : null,
              }
            : user,
        ),
      )

      toast({
        title: approve ? "Trainer approved" : "Trainer rejected",
        description: approve ? "Trainer has been approved successfully." : "Trainer application has been rejected.",
      })

      setIsApproveDialogOpen(false)
      setUserToApprove(null)
      setApprovalNotes("")
    } catch (error) {
      console.error("Error updating trainer status:", error)
      toast({
        title: "Error",
        description: "Failed to update trainer status.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (user: any) => {
    if (user.status === "suspended") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <ShieldX className="h-3 w-3" />
          Suspended
        </Badge>
      )
    }

    if (user.userRole === "trainer") {
      if (!user.trainerStatus || user.trainerStatus === "pending") {
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-300">
            <Shield className="h-3 w-3" />
            Pending Approval
          </Badge>
        )
      }
      if (user.trainerStatus === "approved") {
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
            <ShieldCheck className="h-3 w-3" />
            Approved
          </Badge>
        )
      }
      if (user.trainerStatus === "rejected") {
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800 border-red-300">
            <ShieldAlert className="h-3 w-3" />
            Rejected
          </Badge>
        )
      }
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
        <ShieldCheck className="h-3 w-3" />
        Active
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions.</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <UserCog className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                All Users
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                Pending Approval
              </TabsTrigger>
              <TabsTrigger value="suspended" onClick={() => setStatusFilter("suspended")}>
                Suspended
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="athlete">Athletes</SelectItem>
                <SelectItem value="trainer">Trainers</SelectItem>
                <SelectItem value="coach">Coaches</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.displayName || "Unnamed User"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.userRole === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.userRole === "trainer"
                                ? "bg-blue-100 text-blue-800"
                                : user.userRole === "coach"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.userRole || "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>
                        {user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditUser(user)
                              setIsEditDialogOpen(true)
                            }}
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          {/* Trainer approval button */}
                          {user.userRole === "trainer" && (!user.trainerStatus || user.trainerStatus === "pending") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setUserToApprove(user)
                                setIsApproveDialogOpen(true)
                              }}
                              title="Review trainer application"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              <span className="sr-only">Review</span>
                            </Button>
                          )}

                          {/* Suspend/Reinstate button */}
                          {user.status === "suspended" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReinstateUser(user.id)}
                              title="Reinstate user"
                              className="text-green-500 hover:text-green-700"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              <span className="sr-only">Reinstate</span>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setUserToSuspend(user)
                                setIsSuspendDialogOpen(true)
                              }}
                              title="Suspend user"
                              className="text-amber-500 hover:text-amber-700"
                            >
                              <ShieldX className="h-4 w-4" />
                              <span className="sr-only">Suspend</span>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToDelete(user)
                              setIsDeleteDialogOpen(true)
                            }}
                            title="Delete user"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => fetchUsers()} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user role and permissions.</DialogDescription>
          </DialogHeader>
          {editUser && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value={editUser.displayName || ""} className="col-span-3" disabled />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" value={editUser.email || ""} className="col-span-3" disabled />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={editUser.userRole || "athlete"}
                    onValueChange={(value) => setEditUser({ ...editUser, userRole: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="athlete">Athlete</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRoleChange}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <>
              <div className="py-4">
                <p>
                  <strong>Name:</strong> {userToDelete.displayName || "Unnamed User"}
                </p>
                <p>
                  <strong>Email:</strong> {userToDelete.email}
                </p>
                <p>
                  <strong>Role:</strong> {userToDelete.userRole || "Unknown"}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser}>
                  Delete User
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Suspending a user will prevent them from accessing the platform until reinstated.
            </DialogDescription>
          </DialogHeader>
          {userToSuspend && (
            <>
              <div className="py-4">
                <p>
                  <strong>Name:</strong> {userToSuspend.displayName || "Unnamed User"}
                </p>
                <p>
                  <strong>Email:</strong> {userToSuspend.email}
                </p>
                <p>
                  <strong>Role:</strong> {userToSuspend.userRole || "Unknown"}
                </p>
                <div className="mt-4">
                  <Label htmlFor="suspensionReason">Reason for suspension</Label>
                  <textarea
                    id="suspensionReason"
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md text-black bg-white"
                    rows={3}
                    placeholder="Enter reason for suspension..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleSuspendUser}>
                  Suspend User
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Trainer Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Trainer Application</DialogTitle>
            <DialogDescription>
              Review and approve or reject this trainer's application to sell products and services.
            </DialogDescription>
          </DialogHeader>
          {userToApprove && (
            <>
              <div className="py-4">
                <p>
                  <strong>Name:</strong> {userToApprove.displayName || "Unnamed User"}
                </p>
                <p>
                  <strong>Email:</strong> {userToApprove.email}
                </p>
                <p>
                  <strong>Applied:</strong>{" "}
                  {userToApprove.createdAt?.toDate
                    ? new Date(userToApprove.createdAt.toDate()).toLocaleDateString()
                    : "Unknown"}
                </p>

                <div className="mt-4">
                  <Label htmlFor="approvalNotes">Notes (optional)</Label>
                  <textarea
                    id="approvalNotes"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md text-black bg-white"
                    rows={3}
                    placeholder="Add notes about this decision..."
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="destructive" onClick={() => handleApproveTrainer(false)}>
                  Reject Application
                </Button>
                <Button variant="default" onClick={() => handleApproveTrainer(true)}>
                  Approve Trainer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
