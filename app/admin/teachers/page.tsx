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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function TeachersPage() {
  const { users, courses, addUser, updateUser, deleteUser } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  })

  const teachers = users.filter((u) => u.role === "teacher")

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      bio: "",
    })
    setEditingTeacher(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTeacher) {
      const updateData: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
      }
      if (formData.password) {
        updateData.password = formData.password
      }
      updateUser(editingTeacher, updateData)
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "teacher",
        bio: formData.bio,
      })
    }
    resetForm()
    setIsOpen(false)
  }

  const handleEdit = (teacherId: string) => {
    const teacher = users.find((u) => u.id === teacherId)
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        password: "",
        bio: teacher.bio || "",
      })
      setEditingTeacher(teacherId)
      setIsOpen(true)
    }
  }

  const handleDelete = (teacherId: string) => {
    const teacherCourses = courses.filter((c) => c.teacherId === teacherId)
    if (teacherCourses.length > 0) {
      alert(
        `Este profesor tiene ${teacherCourses.length} curso(s) asignado(s). Reasigna los cursos antes de eliminar.`
      )
      return
    }
    if (confirm("Esta seguro de eliminar este profesor?")) {
      deleteUser(teacherId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profesores</h1>
          <p className="text-muted-foreground">Gestiona los profesores de la plataforma</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Profesor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? "Editar Profesor" : "Crear Nuevo Profesor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {editingTeacher ? "Nueva Contrasena (dejar vacio para mantener)" : "Contrasena"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingTeacher}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Descripcion del profesor..."
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
                  {editingTeacher ? "Guardar Cambios" : "Crear Profesor"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay profesores registrados</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crea tu primer profesor haciendo clic en &quot;Nuevo Profesor&quot;
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => {
                  const teacherCourses = courses.filter(
                    (c) => c.teacherId === teacher.id
                  )
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {teacher.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            {teacher.bio && (
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {teacher.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacherCourses.length}</TableCell>
                      <TableCell>
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(teacher.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(teacher.id)}
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
