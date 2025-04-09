"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { Download, FileText, Search, CreditCard, DollarSign, BarChart } from "lucide-react"
import { useEffect, useState } from "react"

// Mock data for billing since we don't have actual billing data yet
const mockTransactions = [
  {
    id: "tx-1",
    date: new Date(2023, 10, 15),
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    amount: 99.99,
    status: "completed",
    type: "subscription",
    plan: "Premium Trainer",
  },
  {
    id: "tx-2",
    date: new Date(2023, 10, 14),
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    amount: 49.99,
    status: "completed",
    type: "subscription",
    plan: "Basic Trainer",
  },
  {
    id: "tx-3",
    date: new Date(2023, 10, 12),
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
    },
    amount: 149.99,
    status: "completed",
    type: "subscription",
    plan: "Elite Trainer",
  },
  {
    id: "tx-4",
    date: new Date(2023, 10, 10),
    user: {
      name: "Sarah Williams",
      email: "sarah@example.com",
    },
    amount: 99.99,
    status: "refunded",
    type: "subscription",
    plan: "Premium Trainer",
  },
  {
    id: "tx-5",
    date: new Date(2023, 10, 8),
    user: {
      name: "David Brown",
      email: "david@example.com",
    },
    amount: 49.99,
    status: "completed",
    type: "subscription",
    plan: "Basic Trainer",
  },
]

export default function BillingPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [trainers, setTrainers] = useState<any[]>([])

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true)
        const trainersRef = collection(db, "trainers")
        const q = query(trainersRef, orderBy("createdAt", "desc"), limit(5))
        const querySnapshot = await getDocs(q)

        const fetchedTrainers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setTrainers(fetchedTrainers)
      } catch (error) {
        console.error("Error fetching trainers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setTransactions(mockTransactions)
      return
    }

    const searchTermLower = searchTerm.toLowerCase()
    const filteredTransactions = mockTransactions.filter(
      (tx) =>
        tx.user.email.toLowerCase().includes(searchTermLower) ||
        tx.user.name.toLowerCase().includes(searchTermLower) ||
        tx.id.toLowerCase().includes(searchTermLower),
    )

    setTransactions(filteredTransactions)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)

    if (status === "all") {
      setTransactions(mockTransactions)
      return
    }

    const filteredTransactions = mockTransactions.filter((tx) => tx.status === status)

    setTransactions(filteredTransactions)
  }

  // Calculate total revenue
  const totalRevenue = transactions.filter((tx) => tx.status === "completed").reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage subscriptions, payments, and billing information.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trainers</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
            <p className="text-xs text-muted-foreground">+4.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>View and manage payment transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
                </div>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">{tx.id}</TableCell>
                          <TableCell>{tx.date.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{tx.user.name}</p>
                              <p className="text-sm text-muted-foreground">{tx.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>${tx.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tx.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : tx.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : tx.status === "refunded"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Manage recurring subscriptions and plans.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Active Users</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Basic Trainer</TableCell>
                      <TableCell>$49.99/month</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>$1,199.76/month</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Premium Trainer</TableCell>
                      <TableCell>$99.99/month</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>$1,799.82/month</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Elite Trainer</TableCell>
                      <TableCell>$149.99/month</TableCell>
                      <TableCell>7</TableCell>
                      <TableCell>$1,049.93/month</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Download and manage invoices.</CardDescription>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV-001</TableCell>
                      <TableCell>Nov 15, 2023</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>$99.99</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV-002</TableCell>
                      <TableCell>Nov 14, 2023</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>$49.99</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV-003</TableCell>
                      <TableCell>Nov 12, 2023</TableCell>
                      <TableCell>Mike Johnson</TableCell>
                      <TableCell>$149.99</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
