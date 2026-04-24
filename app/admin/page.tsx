"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, GraduationCap, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const { courses, users, enrollments } = useStore()

  const teachers = users.filter((u) => u.role === "teacher")
  const students = users.filter((u) => u.role === "student")
  const activeCourses = courses.filter((c) => c.isPublished)

  const completedEnrollments = enrollments.filter((e) => e.completed).length
  const totalEnrollments = enrollments.length
  const completionRate = totalEnrollments > 0 
    ? Math.round((completedEnrollments / totalEnrollments) * 100) 
    : 0

  const stats = [
    {
      title: "Total Cursos",
      value: courses.length,
      subtitle: `${activeCourses.length} publicados`,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Profesores",
      value: teachers.length,
      subtitle: "Registrados",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Estudiantes",
      value: students.length,
      subtitle: `${totalEnrollments} inscripciones`,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Tasa de Completado",
      value: `${completionRate}%`,
      subtitle: `${completedEnrollments} completados`,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ]

  const recentEnrollments = enrollments
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la plataforma</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cursos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay cursos creados</p>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => {
                  const teacher = users.find((u) => u.id === course.teacherId)
                  return (
                    <div key={course.id} className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage: course.thumbnail
                            ? `url(${course.thumbnail})`
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {teacher?.name || "Sin profesor"}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          course.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {course.isPublished ? "Publicado" : "Borrador"}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscripciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEnrollments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay inscripciones</p>
            ) : (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => {
                  const student = users.find((u) => u.id === enrollment.userId)
                  const course = courses.find((c) => c.id === enrollment.courseId)
                  return (
                    <div key={enrollment.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student?.name || "Usuario"}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {course?.title || "Curso"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
