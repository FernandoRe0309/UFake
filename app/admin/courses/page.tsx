"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Video } from "lucide-react"
import Link from "next/link"

export default function CoursesPage() {
  const { courses, users, addCourse, updateCourse, deleteCourse, enrollments } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacherId: "",
    category: "",
    thumbnail: "",
    isPublished: false,   // ← NUEVO: controla si se publica al crear
  })

  const teachers = users.filter((u) => u.role === "teacher")

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      teacherId: "",
      category: "",
      thumbnail: "",
      isPublished: false,
    })
    setEditingCourse(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCourse) {
      updateCourse(editingCourse, formData)
    } else {
      addCourse(formData)   // ahora formData incluye isPublished
    }
    resetForm()
    setIsOpen(false)
  }

  const handleEdit = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        teacherId: course.teacherId,
        category: course.category,
        thumbnail: course.thumbnail || "",
        isPublished: course.isPublished,   // ← carga el estado actual al editar
      })
      setEditingCourse(courseId)
      setIsOpen(true)
    }
  }

  const handleDelete = (courseId: string) => {
    if (confirm("Esta seguro de eliminar este curso?")) {
      deleteCourse(courseId)
    }
  }

  const togglePublish = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      updateCourse(courseId, { isPublished: !course.isPublished })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground">Gestiona los cursos de la plataforma</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripcion</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher">Profesor</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="ej: Programacion, Diseno, Marketing"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL de Imagen (opcional)</Label>
                <Input
                  id="thumbnail"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* ── NUEVO: Toggle publicar ── */}
              <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/40">
                <div>
                  <Label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                    Publicar inmediatamente
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Los estudiantes podrán ver el curso en el catálogo
                  </p>
                </div>
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublished: checked })
                  }
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setIsOpen(false)
                  resetForm()
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCourse ? "Guardar Cambios" : "Crear Curso"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay cursos creados</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crea tu primer curso haciendo clic en el botón &quot;Nuevo Curso&quot;
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Lecciones</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const teacher = users.find((u) => u.id === course.teacherId)
                  const studentCount = enrollments.filter(
                    (e) => e.courseId === course.id
                  ).length
                  return (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: course.thumbnail
                                ? `url(${course.thumbnail})`
                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          />
                          <span className="font-medium">{course.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{teacher?.name || "Sin asignar"}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>{course.lessons.length}</TableCell>
                      <TableCell>{studentCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={course.isPublished ? "default" : "secondary"}
                          className="cursor-pointer select-none"
                          onClick={() => togglePublish(course.id)}
                        >
                          {course.isPublished ? "Publicado" : "Borrador"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/courses/${course.id}/lessons`}>
                              <Video className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(course.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(course.id)}
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
