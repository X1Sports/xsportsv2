import { SearchTrainers } from "@/components/search-trainers"
import { FeaturedTrainers } from "@/components/featured-trainers"
import { SportCategories } from "@/components/sport-categories"

export default function SearchPage() {
  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      <h1 className="text-3xl font-bold mb-6">Find Your X:1 Trainer</h1>

      <div className="grid gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <SearchTrainers />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Browse by Sport</h2>
          <SportCategories />
        </div>

        <div>
          <FeaturedTrainers />
        </div>
      </div>
    </div>
  )
}
