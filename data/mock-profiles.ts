export type Trainer = {
  id: string
  name: string
  image: string
  sports: string[]
  location: string
  experience: string
  price: number
  rating: number
  reviews: number
  specialty: string
  availability: string
  bio: string
}

export type Athlete = {
  id: string
  name: string
  image: string
  sports: string[]
  location: string
  age: number
  level: string
  goals: string
  bio: string
}

export const trainers: Trainer[] = [
  {
    id: "t1",
    name: "John Davis",
    image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format",
    sports: ["Basketball", "Track & Field"],
    location: "New York, NY",
    experience: "10+ years",
    price: 75,
    rating: 4.9,
    reviews: 124,
    specialty: "Shooting Coach",
    availability: "Mon-Fri, 7AM-7PM",
    bio: "Elite performance coach specializing in basketball shooting techniques and track & field training. Worked with college and professional athletes for over a decade.",
  },
  {
    id: "t2",
    name: "Sarah Miller",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format",
    sports: ["Mixed Martial Arts", "Boxing"],
    location: "Los Angeles, CA",
    experience: "8 years",
    price: 65,
    rating: 4.8,
    reviews: 98,
    specialty: "Fighting Technique",
    availability: "Mon-Sat, 6AM-6PM",
    bio: "Former professional MMA fighter with championship experience. Specializes in technique development and fight preparation for all skill levels.",
  },
  {
    id: "t3",
    name: "Mike Thompson",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format",
    sports: ["Brazilian Jiu-jitsu", "Wrestling"],
    location: "Chicago, IL",
    experience: "12 years",
    price: 90,
    rating: 4.7,
    reviews: 56,
    specialty: "Ground Work",
    availability: "Tue-Sun, 8AM-8PM",
    bio: "Black belt in Brazilian Jiu-jitsu with collegiate wrestling background. Focuses on technical ground work and competition preparation.",
  },
  {
    id: "t4",
    name: "Emma Rodriguez",
    image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?q=80&w=400&auto=format",
    sports: ["Soccer", "Fitness"],
    location: "Miami, FL",
    experience: "7 years",
    price: 70,
    rating: 4.9,
    reviews: 87,
    specialty: "Technical Skills & Conditioning",
    availability: "Mon-Fri, 3PM-9PM",
    bio: "Former D1 soccer player with strength and conditioning certification. Specializes in technical skill development and sport-specific fitness training.",
  },
  {
    id: "t5",
    name: "David Kim",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format",
    sports: ["Tennis", "Badminton"],
    location: "Boston, MA",
    experience: "15 years",
    price: 85,
    rating: 4.8,
    reviews: 112,
    specialty: "Racket Sports Technique",
    availability: "Mon-Sun, 9AM-8PM",
    bio: "Former ATP tour player with extensive coaching experience. Specializes in technical development and match strategy for competitive players.",
  },
]

export const athletes: Athlete[] = [
  {
    id: "a1",
    name: "Alex Johnson",
    image: "/placeholder.svg?height=128&width=128&text=AJ",
    sports: ["Basketball"],
    location: "Chicago, IL",
    age: 19,
    level: "College",
    goals: "Improve shooting accuracy and defensive footwork",
    bio: "Point guard at University of Illinois looking to improve technical skills during off-season.",
  },
  {
    id: "a2",
    name: "Taylor Williams",
    image: "/placeholder.svg?height=128&width=128&text=TW",
    sports: ["Soccer"],
    location: "Seattle, WA",
    age: 16,
    level: "High School",
    goals: "Increase speed and improve ball control",
    bio: "High school varsity soccer player with aspirations to play at the collegiate level.",
  },
  {
    id: "a3",
    name: "Jordan Smith",
    image: "/placeholder.svg?height=128&width=128&text=JS",
    sports: ["Mixed Martial Arts"],
    location: "Las Vegas, NV",
    age: 24,
    level: "Amateur",
    goals: "Prepare for upcoming amateur competition",
    bio: "Amateur MMA fighter with 3-1 record looking to improve striking and ground game.",
  },
  {
    id: "a4",
    name: "Morgan Lee",
    image: "/placeholder.svg?height=128&width=128&text=ML",
    sports: ["Swimming"],
    location: "San Diego, CA",
    age: 15,
    level: "Competitive",
    goals: "Improve technique and reduce race times",
    bio: "Competitive swimmer specializing in freestyle and butterfly events, aiming for state championships.",
  },
  {
    id: "a5",
    name: "Casey Martinez",
    image: "/placeholder.svg?height=128&width=128&text=CM",
    sports: ["Tennis"],
    location: "Miami, FL",
    age: 28,
    level: "Recreational",
    goals: "Improve overall game for local tournaments",
    bio: "Recreational tennis player competing in local leagues and tournaments, looking to advance skills.",
  },
]

export const sportsList = [
  "Basketball",
  "Soccer",
  "Football",
  "Baseball",
  "Tennis",
  "Swimming",
  "Track & Field",
  "Golf",
  "Volleyball",
  "Wrestling",
  "Boxing",
  "Mixed Martial Arts",
  "Brazilian Jiu-jitsu",
  "Gymnastics",
  "Hockey",
  "Lacrosse",
  "Rugby",
  "Cycling",
  "Weightlifting",
  "CrossFit",
]

export const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "Nashville, TN",
  "Baltimore, MD",
  "Oklahoma City, OK",
  "Portland, OR",
  "Las Vegas, NV",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Sacramento, CA",
  "Long Beach, CA",
  "Kansas City, MO",
  "Mesa, AZ",
  "Atlanta, GA",
  "Colorado Springs, CO",
  "Raleigh, NC",
  "Omaha, NE",
  "Miami, FL",
  "Oakland, CA",
  "Minneapolis, MN",
  "Tulsa, OK",
  "Cleveland, OH",
  "Wichita, KS",
  "Arlington, TX",
  "New Orleans, LA",
  "Bakersfield, CA",
  "Tampa, FL",
  "Honolulu, HI",
  "Aurora, CO",
]
