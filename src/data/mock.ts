import { Challenge, Course, Mentor, User } from "@/types"

export const currentUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg",
  level: 5,
  xp: 2500,
  achievements: [], // Added missing property
  streakDays: 0, // Added missing property
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyProgress: true,
  },
}

export const activeCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React development",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    progress: 65,
    totalLessons: 20,
    completedLessons: 13,
    category: "Frontend",
    level: "beginner",
    duration: "8 hours",
    modules: [ // Added modules property
      {
        id: "m1",
        title: "Introduction to React",
        lessons: [
          {
            id: "l1",
            title: "Getting Started",
            videoUrl: "https://example.com/video1",
            completed: true
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript and its advanced features",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    progress: 30,
    totalLessons: 15,
    completedLessons: 5,
    category: "Programming",
    level: "advanced",
    duration: "12 hours",
    modules: [] // Added modules property
  },
]

export const recommendedCourses: Course[] = [
  {
    id: "3",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    progress: 0,
    totalLessons: 25,
    completedLessons: 0,
    category: "Backend",
    level: "intermediate",
    duration: "15 hours",
    modules: [] // Added modules property
  },
]

export const activeChallenges: Challenge[] = [
  {
    id: "1",
    title: "Build a REST API",
    description: "Create a RESTful API using Express and TypeScript",
    course: "Node.js Backend Development",
    xpPoints: 100,
    deadline: "2024-04-01",
    status: "pending",
  },
  {
    id: "2",
    title: "React Component Library",
    description: "Build a reusable component library with React and TypeScript",
    course: "React Fundamentals",
    xpPoints: 150,
    deadline: "2024-04-15",
    status: "pending",
  },
]

export const availableMentors: Mentor[] = [
  {
    id: "1",
    name: "Jane Smith",
    avatar: "/placeholder.svg",
    specialty: "Frontend Development",
    rating: 4.8,
    available: true,
    onlineStatus: "online" // Added missing property
  },
  {
    id: "2",
    name: "Michael Johnson",
    avatar: "/placeholder.svg",
    specialty: "Backend Development",
    rating: 4.9,
    available: true,
    onlineStatus: "online" // Added missing property
  },
  {
    id: "3",
    name: "Sarah Wilson",
    avatar: "/placeholder.svg",
    specialty: "Full Stack Development",
    rating: 4.7,
    available: true,
    onlineStatus: "online" // Added missing property
  },
]