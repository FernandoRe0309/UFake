"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Award } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const { currentUser, courses, enrollments, users } = useStore()

  if (!currentUser) return null

  const myEnrollments = enrollments.filter((e) => e.userId === currentUser.id)
  const completedCourses = myEnrollments.filter((e) => e.completed).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bienvenido, {currentUser.name}</h1>
        <p className="text-muted-foreground">Continua tu aprendizaje</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursos Inscritos
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myEnrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursos Completados
            </CardTitle>
            <Award className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progreso General
            </CardTitle>
            <Play className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {myEnrollments.length > 0
                ? Math.round((completedCourses / myEnrollments.length) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Mis Cursos</h2>
        {myEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Aun no te has inscrito en ningun curso
              </p>
              <Button asChild>
                <Link href="/student/catalog">Explorar Catalogo</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myEnrollments.map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId)
              if (!course) return null

              const teacher = users.find((u) => u.id === course.teacherId)
              const totalLessons = course.lessons.length
              const completedLessons = enrollment.completedLessons.length
              const progress = totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0

              return (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div
                    className="h-32 bg-cover bg-center"
                    style={{
                      backgroundImage: course.thumbnail
                        ? `url(${course.thumbnail})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {course.title}
                      </CardTitle>
                      {enrollment.completed && (
                        <Badge className="bg-green-100 text-green-700 shrink-0">
                          Completado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {teacher?.name || "Instructor"}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {completedLessons} de {totalLessons} lecciones
                      </p>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/student/course/${course.id}`}>
                        {enrollment.completed ? "Repasar" : "Continuar"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
