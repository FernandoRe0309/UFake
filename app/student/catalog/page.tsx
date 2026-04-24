"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Clock, Users } from "lucide-react"

export default function CatalogPage() {
  const { currentUser, courses, users, enrollments, enrollInCourse } = useStore()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (!currentUser) return null

  const publishedCourses = courses.filter((c) => c.isPublished)
  const categories = [...new Set(publishedCourses.map((c) => c.category))]

  const filteredCourses = publishedCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (e) => e.userId === currentUser.id && e.courseId === courseId
    )
  }

  const handleEnroll = (courseId: string) => {
    enrollInCourse(currentUser.id, courseId)
  }

  const getStudentCount = (courseId: string) => {
    return enrollments.filter((e) => e.courseId === courseId).length
  }

  const getTotalDuration = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return 0
    return course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} min`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Catalogo de Cursos</h1>
        <p className="text-muted-foreground">Explora y encuentra cursos para aprender</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No se encontraron cursos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const teacher = users.find((u) => u.id === course.teacherId)
            const enrolled = isEnrolled(course.id)
            const studentCount = getStudentCount(course.id)
            const duration = getTotalDuration(course.id)

            return (
              <Card key={course.id} className="overflow-hidden flex flex-col">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: course.thumbnail
                      ? `url(${course.thumbnail})`
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary">{course.category}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 mt-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {teacher?.name || "Instructor"}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 mt-auto">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessons.length} lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {studentCount}
                    </span>
                  </div>
                  {enrolled ? (
                    <Button variant="secondary" disabled className="w-full">
                      Ya inscrito
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Inscribirse
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
