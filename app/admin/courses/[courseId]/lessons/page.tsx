"use client"

import { useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Play, ArrowLeft, Upload, GripVertical } from "lucide-react"
import Link from "next/link"

export default function LessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { courses, addLesson, updateLesson, deleteLesson } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const course = courses.find((c) => c.id === courseId)

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Curso no encontrado</p>
        <Button variant="link" asChild>
          <Link href="/admin/courses">Volver a cursos</Link>
        </Button>
      </div>
    )
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
    })
    setEditingLesson(null)
    setVideoFile(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      const videoUrl = URL.createObjectURL(file)
      setFormData({ ...formData, videoUrl })
      
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src)
        setFormData((prev) => ({ ...prev, duration: Math.round(video.duration) }))
      }
      video.src = videoUrl
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const lessonData = {
      ...formData,
      videoUrl: videoFile ? URL.createObjectURL(videoFile) : formData.videoUrl,
    }

    if (editingLesson) {
      updateLesson(courseId, editingLesson, lessonData)
    } else {
      addLesson(courseId, lessonData)
    }
    resetForm()
    setIsOpen(false)
  }

  const handleEdit = (lessonId: string) => {
    const lesson = course.lessons.find((l) => l.id === lessonId)
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
      })
      setEditingLesson(lessonId)
      setIsOpen(true)
    }
  }

  const handleDelete = (lessonId: string) => {
    if (confirm("Esta seguro de eliminar esta leccion?")) {
      deleteLesson(courseId, lessonId)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Gestiona las lecciones del curso</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Leccion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? "Editar Leccion" : "Crear Nueva Leccion"}
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
                <Label>Video</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="URL del video o sube un archivo"
                    value={videoFile ? videoFile.name : formData.videoUrl}
                    onChange={(e) => {
                      if (!videoFile) {
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                    }}
                    readOnly={!!videoFile}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {videoFile && (
                  <p className="text-xs text-muted-foreground">
                    Archivo: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duracion (segundos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  min="0"
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
                  {editingLesson ? "Guardar Cambios" : "Crear Leccion"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lecciones ({course.lessons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {course.lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay lecciones en este curso</p>
              <p className="text-sm text-muted-foreground mt-1">
                Agrega la primera leccion haciendo clic en &quot;Nueva Leccion&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="text-muted-foreground cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {lesson.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatDuration(lesson.duration)}
                  </Badge>
                  <div className="flex gap-1">
                    {lesson.videoUrl && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">
                          <Play className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(lesson.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
