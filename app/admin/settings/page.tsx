"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Save } from "lucide-react"

export default function SettingsPage() {
  const { currentUser, updateUser } = useStore()
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser) {
      updateUser(currentUser.id, {
        name: formData.name,
        email: formData.email,
      })
      setMessage({ type: "success", text: "Perfil actualizado correctamente" })
      setTimeout(() => setMessage(null), 3000)
    }
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
    if (currentUser) {
      updateUser(currentUser.id, { password: formData.newPassword })
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      setMessage({ type: "success", text: "Contrasena actualizada correctamente" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Configuracion</h1>
        <p className="text-muted-foreground">Gestiona tu cuenta y preferencias</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Informacion del Perfil</CardTitle>
          <CardDescription>Actualiza tu informacion personal</CardDescription>
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

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zona de Peligro
          </CardTitle>
          <CardDescription>Acciones irreversibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Restablecer Datos de Demo</p>
              <p className="text-sm text-muted-foreground">
                Elimina todos los datos y carga datos de ejemplo
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Esto eliminara todos los datos. Continuar?")) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
            >
              Restablecer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
