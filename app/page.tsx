'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldLabel } from '@/components/ui/field'
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { currentUser, login, register } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/student')
      }
    }
  }, [currentUser, router, mounted])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const user = login(loginEmail, loginPassword)
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/student')
      }
    } else {
      setError('Correo o contrasena incorrectos')
    }
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!registerName || !registerEmail || !registerPassword) {
      setError('Todos los campos son requeridos')
      setIsLoading(false)
      return
    }

    const user = register({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      role: 'student',
    })

    login(user.email, user.password)
    router.push('/student')
    setIsLoading(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">EduPlatform</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left side - Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
                Aprende sin limites con nuestra plataforma educativa
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Accede a cientos de cursos impartidos por expertos. Obtén certificados 
                reconocidos y avanza en tu carrera profesional.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-card-foreground">100+</p>
                  <p className="text-sm text-muted-foreground">Cursos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-card-foreground">5000+</p>
                  <p className="text-sm text-muted-foreground">Estudiantes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-card-foreground">1000+</p>
                  <p className="text-sm text-muted-foreground">Certificados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>Bienvenido</CardTitle>
                <CardDescription>
                  Inicia sesion o crea una cuenta para comenzar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Iniciar Sesion</TabsTrigger>
                    <TabsTrigger value="register">Registrarse</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 pt-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <Field>
                        <FieldLabel>Correo electronico</FieldLabel>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Contrasena</FieldLabel>
                        <Input
                          type="password"
                          placeholder="********"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </Field>
                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesion'}
                      </Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground">
                      Admin: admin@eduplatform.com / admin123
                    </p>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4 pt-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <Field>
                        <FieldLabel>Nombre completo</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Juan Perez"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Correo electronico</FieldLabel>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Contrasena</FieldLabel>
                        <Input
                          type="password"
                          placeholder="********"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                      </Field>
                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
