export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  modules?: {
    id: string
    title: string
    lessons: {
      id: string
      title: string
      videoUrl: string
      completed: boolean
    }[]
  }[]
  currentLesson?: {
    id: string
    title: string
    videoUrl: string
    completed: boolean
  }
  quiz?: {
    id: string
    questions: {
      id: string
      question: string
      options: string[]
      correctAnswer: number
    }[]
  }
}

export interface Challenge {
  id: string
  title: string
  description: string
  course: string
  xpPoints: number
  deadline: string
  status: "pending" | "completed"
}

export interface Mentor {
  id: string
  name: string
  avatar: string
  specialty: string
  rating: number
  available: boolean
  onlineStatus: "online" | "offline" | "busy"
  lastSeen?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  achievements: Achievement[]
  streakDays: number
  preferences?: {
    emailNotifications: boolean
    pushNotifications: boolean
    weeklyProgress: boolean
  }
}

export interface Plan {
  id: string
  name: string
  price: number
  interval: "monthly" | "yearly"
  features: string[]
  recommended?: boolean
  description: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

export interface Essay {
  id: string
  title: string
  prompt: string
  studentText?: string
  feedback?: string
  status: "pending" | "submitted" | "reviewed"
  submittedAt?: string
  reviewedAt?: string
  score?: number
}

export interface MockExam {
  id: string
  title: string
  description: string
  duration: number
  totalQuestions: number
  sections: {
    id: string
    title: string
    questions: {
      id: string
      question: string
      options: string[]
      correctAnswer: number
    }[]
  }[]
}
