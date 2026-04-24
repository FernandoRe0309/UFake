"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Circle,
  Award,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { currentUser, courses, users, enrollments, completeLesson, completeCourse } = useStore()
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const course = courses.find((c) => c.id === courseId)
  const enrollment = enrollments.find(
    (e) => e.userId === currentUser?.id && e.courseId === courseId
  )

  useEffect(() => {
    if (enrollment && course) {
      const lastCompletedIndex = course.lessons.findIndex(
        (lesson) => !enrollment.completedLessons.includes(lesson.id)
      )
      if (lastCompletedIndex !== -1) {
        setCurrentLessonIndex(lastCompletedIndex)
      }
    }
  }, [])

  if (!currentUser || !course || !enrollment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Curso no encontrado o no estas inscrito</p>
        <Button variant="link" asChild>
          <Link href="/student">Volver a mis cursos</Link>
        </Button>
      </div>
    )
  }

  const teacher = users.find((u) => u.id === course.teacherId)
  const currentLesson = course.lessons[currentLessonIndex]
  const completedLessons = enrollment.completedLessons.length
  const totalLessons = course.lessons.length
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const isLessonCompleted = (lessonId: string) => {
    return enrollment.completedLessons.includes(lessonId)
  }

  const handleLessonComplete = () => {
    if (currentLesson && !isLessonCompleted(currentLesson.id)) {
      completeLesson(currentUser.id, courseId, currentLesson.id)
      
      const newCompletedCount = completedLessons + 1
      if (newCompletedCount === totalLessons) {
        completeCourse(currentUser.id, courseId)
      }
    }
  }

  const handleVideoEnded = () => {
    handleLessonComplete()
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
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
          <Link href="/student">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{teacher?.name || "Instructor"}</p>
        </div>
        {enrollment.completed && (
          <Badge className="bg-green-100 text-green-700 gap-1">
            <Award className="h-4 w-4" />
            Completado
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black">
              {currentLesson?.videoUrl ? (
                <video
                  ref={videoRef}
                  src={currentLesson.videoUrl}
                  controls
                  className="w-full h-full"
                  onEnded={handleVideoEnded}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Video no disponible</p>
                </div>
              )}
            </div>
          </Card>

          {currentLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentLesson.title}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(currentLesson.duration)}
                    </p>
                  </div>
                  {!isLessonCompleted(currentLesson.id) ? (
                    <Button onClick={handleLessonComplete}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Marcar como completada
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Completada
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{currentLesson.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Progreso del Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedLessons} de {totalLessons} lecciones completadas ({progress}%)
              </p>
              {enrollment.completed && (
                <Button asChild className="w-full mt-4">
                  <Link href="/student/certificates">
                    <Award className="h-4 w-4 mr-2" />
                    Ver Certificado
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Contenido del Curso</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-1">
                  {course.lessons.map((lesson, index) => {
                    const completed = isLessonCompleted(lesson.id)
                    const isCurrent = index === currentLessonIndex
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(index)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          isCurrent
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="shrink-0">
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : isCurrent ? (
                            <Play className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            completed ? "text-muted-foreground" : ""
                          }`}>
                            {index + 1}. {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDuration(lesson.duration)}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
