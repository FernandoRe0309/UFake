"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateCertificatePDF } from "@/lib/certificate"
import { Award, Download, Calendar } from "lucide-react"

export default function CertificatesPage() {
  const { currentUser, courses, enrollments, users } = useStore()

  if (!currentUser) return null

  const completedEnrollments = enrollments.filter(
    (e) => e.userId === currentUser.id && e.completed
  )

  const handleDownload = (enrollment: typeof completedEnrollments[0]) => {
    const course = courses.find((c) => c.id === enrollment.courseId)
    if (!course || !enrollment.completedAt) return

    generateCertificatePDF(
      currentUser.name,
      course.title,
      new Date(enrollment.completedAt)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Certificados</h1>
        <p className="text-muted-foreground">
          Descarga los certificados de los cursos que has completado
        </p>
      </div>

      {completedEnrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Aun no has completado ningun curso
            </p>
            <p className="text-sm text-muted-foreground">
              Completa un curso para obtener tu certificado
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {completedEnrollments.map((enrollment) => {
            const course = courses.find((c) => c.id === enrollment.courseId)
            if (!course) return null

            const teacher = users.find((u) => u.id === course.teacherId)

            return (
              <Card key={enrollment.id} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Award className="h-16 w-16 text-primary/50" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {teacher?.name || "Instructor"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Completado el{" "}
                      {enrollment.completedAt
                        ? new Date(enrollment.completedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleDownload(enrollment)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Certificado
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
