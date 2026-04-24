export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "student" | "teacher"
  bio?: string
  avatar?: string
  createdAt: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  teacherId: string
  category: string
  lessons: Lesson[]
  isPublished: boolean
  createdAt: string
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  completedLessons: string[]
  completed: boolean
  enrolledAt: string
  completedAt?: string
}
