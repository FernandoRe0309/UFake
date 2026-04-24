"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Save, BookOpen, Award, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { currentUser, updateUser, enrollments, courses } = useStore()
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!currentUser) return null

  const myEnrollments = enrollments.filter((e) => e.userId === currentUser.id)
  const completedCourses = myEnrollments.filter((e) => e.completed).length

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(currentUser.id, {
      name: formData.name,
      email: formData.email,
    })
    setMessage({ type: "success", text: "Perfil actualizado correctamente" })
    setTimeout(() => setMessage(null), 3000)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Las contrasenas no coinciden" })
      return
    }
    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "La contrasena debe tener al menos 6 caracteres" })
      return
    }
    updateUser(currentUser.id, { password: formData.newPassword })
    setFormData((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }))
    setMessage({ type: "success", text: "Contrasena actualizada correctamente" })
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu informacion personal</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {currentUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <p className="text-muted-foreground">{currentUser.email}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Miembro desde {new Date(currentUser.createdAt).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Cursos Inscritos</span>
                </div>
                <span className="font-bold">{myEnrollments.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Completados</span>
                </div>
                <span className="font-bold">{completedCourses}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso General</span>
                  <span>
                    {myEnrollments.length > 0
                      ? Math.round((completedCourses / myEnrollments.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    myEnrollments.length > 0
                      ? (completedCourses / myEnrollments.length) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacion Personal</CardTitle>
              <CardDescription>Actualiza tu informacion de perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
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
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contrasena</CardTitle>
              <CardDescription>Actualiza tu contrasena de acceso</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contrasena</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contrasena</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Cambiar Contrasena
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
