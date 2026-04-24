"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Course, Lesson, Enrollment } from "./types"

interface AppState {
  currentUser: User | null
  users: User[]
  courses: Course[]
  enrollments: Enrollment[]

  login: (email: string, password: string) => User | null
  register: (user: Omit<User, "id" | "createdAt">) => User
  logout: () => void

  addUser: (user: Omit<User, "id" | "createdAt">) => User
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void

  // ← isPublished ya no se omite: el form puede pasarlo
  addCourse: (course: Omit<Course, "id" | "createdAt" | "lessons"> & { isPublished?: boolean }) => Course
  updateCourse: (id: string, data: Partial<Course>) => void
  deleteCourse: (id: string) => void

  addLesson: (courseId: string, lesson: Omit<Lesson, "id" | "order">) => void
  updateLesson: (courseId: string, lessonId: string, data: Partial<Lesson>) => void
  deleteLesson: (courseId: string, lessonId: string) => void

  enrollInCourse: (userId: string, courseId: string) => Enrollment
  completeLesson: (userId: string, courseId: string, lessonId: string) => void
  completeCourse: (userId: string, courseId: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const defaultAdmin: User = {
  id: "admin-1",
  email: "admin@eduplatform.com",
  password: "admin123",
  name: "Administrador",
  role: "admin",
  createdAt: new Date().toISOString(),
}

const demoTeacher: User = {
  id: "teacher-1",
  email: "profesor@eduplatform.com",
  password: "profesor123",
  name: "Maria Garcia",
  role: "teacher",
  bio: "Instructora con 10 anos de experiencia en desarrollo web",
  createdAt: new Date().toISOString(),
}

const demoCourse: Course = {
  id: "course-1",
  title: "Introduccion a JavaScript",
  description: "Aprende los fundamentos de JavaScript desde cero. Este curso te llevara desde los conceptos basicos hasta temas intermedios.",
  thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
  teacherId: "teacher-1",
  category: "Programacion",
  lessons: [
    {
      id: "lesson-1",
      title: "Que es JavaScript?",
      description: "Introduccion al lenguaje de programacion JavaScript y su historia.",
      videoUrl: "",
      duration: 600,
      order: 1,
    },
    {
      id: "lesson-2",
      title: "Variables y Tipos de Datos",
      description: "Aprende sobre variables, constantes y los diferentes tipos de datos en JavaScript.",
      videoUrl: "",
      duration: 900,
      order: 2,
    },
    {
      id: "lesson-3",
      title: "Funciones",
      description: "Como crear y utilizar funciones en JavaScript.",
      videoUrl: "",
      duration: 1200,
      order: 3,
    },
  ],
  isPublished: true,
  createdAt: new Date().toISOString(),
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [defaultAdmin, demoTeacher],
      courses: [demoCourse],
      enrollments: [],

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && u.password === password)
        if (user) {
          set({ currentUser: user })
          return user
        }
        return null
      },

      register: (userData) => {
        const existingUser = get().users.find((u) => u.email === userData.email)
        if (existingUser) {
          throw new Error("El email ya esta registrado")
        }
        const newUser: User = {
          ...userData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ users: [...state.users, newUser] }))
        return newUser
      },

      logout: () => set({ currentUser: null }),

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ users: [...state.users, newUser] }))
        return newUser
      },

      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
          currentUser:
            state.currentUser?.id === id
              ? { ...state.currentUser, ...data }
              : state.currentUser,
        }))
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          enrollments: state.enrollments.filter((e) => e.userId !== id),
        }))
      },

      addCourse: (courseData) => {
        const newCourse: Course = {
          ...courseData,
          id: generateId(),
          lessons: [],
          // ← FIX: usa el valor del form; si no viene, por defecto false
          isPublished: courseData.isPublished ?? false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ courses: [...state.courses, newCourse] }))
        return newCourse
      },

      updateCourse: (id, data) => {
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }))
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          enrollments: state.enrollments.filter((e) => e.courseId !== id),
        }))
      },

      addLesson: (courseId, lessonData) => {
        set((state) => ({
          courses: state.courses.map((c) => {
            if (c.id === courseId) {
              const newLesson: Lesson = {
                ...lessonData,
                id: generateId(),
                order: c.lessons.length + 1,
              }
              return { ...c, lessons: [...c.lessons, newLesson] }
            }
            return c
          }),
        }))
      },

      updateLesson: (courseId, lessonId, data) => {
        set((state) => ({
          courses: state.courses.map((c) => {
            if (c.id === courseId) {
              return {
                ...c,
                lessons: c.lessons.map((l) =>
                  l.id === lessonId ? { ...l, ...data } : l
                ),
              }
            }
            return c
          }),
        }))
      },

      deleteLesson: (courseId, lessonId) => {
        set((state) => ({
          courses: state.courses.map((c) => {
            if (c.id === courseId) {
              return {
                ...c,
                lessons: c.lessons.filter((l) => l.id !== lessonId),
              }
            }
            return c
          }),
        }))
      },

      enrollInCourse: (userId, courseId) => {
        const existing = get().enrollments.find(
          (e) => e.userId === userId && e.courseId === courseId
        )
        if (existing) return existing

        const newEnrollment: Enrollment = {
          id: generateId(),
          userId,
          courseId,
          completedLessons: [],
          completed: false,
          enrolledAt: new Date().toISOString(),
        }
        set((state) => ({ enrollments: [...state.enrollments, newEnrollment] }))
        return newEnrollment
      },

      completeLesson: (userId, courseId, lessonId) => {
        set((state) => ({
          enrollments: state.enrollments.map((e) => {
            if (e.userId === userId && e.courseId === courseId) {
              if (!e.completedLessons.includes(lessonId)) {
                return {
                  ...e,
                  completedLessons: [...e.completedLessons, lessonId],
                }
              }
            }
            return e
          }),
        }))
      },

      completeCourse: (userId, courseId) => {
        set((state) => ({
          enrollments: state.enrollments.map((e) => {
            if (e.userId === userId && e.courseId === courseId) {
              return {
                ...e,
                completed: true,
                completedAt: new Date().toISOString(),
              }
            }
            return e
          }),
        }))
      },
    }),
    {
      name: "eduplatform-storage",
    }
  )
)
