import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function SportCategories() {
  const sports = [
    {
      name: "Football",
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=300&auto=format",
      count: 142,
      color: "from-green-500 to-green-700",
    },
    {
      name: "Basketball",
      image: "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=300&auto=format",
      count: 189,
      color: "from-orange-500 to-orange-700",
    },
    {
      name: "Baseball",
      image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=300&auto=format",
      count: 103,
      color: "from-red-500 to-red-700",
    },
    {
      name: "Soccer",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=300&auto=format",
      count: 156,
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Track & Field",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=300&auto=format",
      count: 94,
      color: "from-purple-500 to-purple-700",
    },
    {
      name: "Wrestling",
      image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=300&auto=format",
      count: 72,
      color: "from-yellow-500 to-yellow-700",
    },
    {
      name: "Swimming",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=300&auto=format",
      count: 86,
      color: "from-cyan-500 to-cyan-700",
    },
    {
      name: "Tennis",
      image: "https://images.unsplash.com/photo-1595435934753-5f8dc7211cc3?q=80&w=300&auto=format",
      count: 68,
      color: "from-emerald-500 to-emerald-700",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Browse by Sport</h2>
        <Link href="/sports" className="text-blue-600 font-medium hover:underline">
          View all sports
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-8">
        {sports.map((sport) => (
          <Link
            key={sport.name}
            href={`/sports/${sport.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="transition-transform hover:scale-105 group"
          >
            <Card className="overflow-hidden border-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={sport.image || "/placeholder.svg"}
                    alt={sport.name}
                    className="object-cover w-full h-full"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${sport.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}
                  />
                  <div className="absolute bottom-0 w-full p-3 text-center text-white">
                    <span className="text-base font-semibold block">{sport.name}</span>
                    <span className="text-xs opacity-90">{sport.count} trainers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
