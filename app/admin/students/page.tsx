"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

export default function StudentsPage() {
  const { users, courses, enrollments, deleteUser } = useStore()

  const students = users.filter((u) => u.role === "student")

  const handleDelete = (studentId: string) => {
    if (confirm("Esta seguro de eliminar este estudiante? Se eliminaran todas sus inscripciones.")) {
      deleteUser(studentId)
    }
  }

  const getStudentProgress = (studentId: string) => {
    const studentEnrollments = enrollments.filter((e) => e.userId === studentId)
    const completed = studentEnrollments.filter((e) => e.completed).length
    const total = studentEnrollments.length
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estudiantes</h1>
        <p className="text-muted-foreground">
          Visualiza los estudiantes registrados y su progreso
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay estudiantes registrados</p>
              <p className="text-sm text-muted-foreground mt-1">
                Los estudiantes pueden registrarse desde la pagina de inicio
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cursos Inscritos</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const progress = getStudentProgress(student.id)
                  const studentEnrollments = enrollments.filter(
                    (e) => e.userId === student.id
                  )
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-700">
                              {student.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {studentEnrollments.length === 0 ? (
                            <span className="text-muted-foreground text-sm">
                              Sin inscripciones
                            </span>
                          ) : (
                            studentEnrollments.slice(0, 2).map((enrollment) => {
                              const course = courses.find(
                                (c) => c.id === enrollment.courseId
                              )
                              return (
                                <Badge
                                  key={enrollment.id}
                                  variant={enrollment.completed ? "default" : "secondary"}
                                  className="mr-1"
                                >
                                  {course?.title.slice(0, 15)}
                                  {course && course.title.length > 15 ? "..." : ""}
                                </Badge>
                              )
                            })
                          )}
                          {studentEnrollments.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{studentEnrollments.length - 2} mas
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32 space-y-1">
                          <Progress value={progress.percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {progress.completed}/{progress.total} completados
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
