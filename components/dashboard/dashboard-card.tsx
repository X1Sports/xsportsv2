import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
  value: string | number
  ctaText: string
  ctaLink: string
  ctaBgColor: string
  ctaHoverColor: string
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  value,
  ctaText,
  ctaLink,
  ctaBgColor,
  ctaHoverColor,
}: DashboardCardProps) {
  return (
    <div
      className="rounded-lg shadow-md hover:shadow-lg transition-shadow p-5"
      style={{
        backgroundColor: "#333333",
        color: "white",
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <Button asChild className={`w-full ${ctaBgColor} hover:${ctaHoverColor}`}>
        <Link href={ctaLink}>{ctaText}</Link>
      </Button>
    </div>
  )
}
