"use client"

import { jsPDF } from "jspdf"

export function generateCertificatePDF(
  studentName: string,
  courseName: string,
  completionDate: Date
): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()

  // Background
  doc.setFillColor(250, 250, 252)
  doc.rect(0, 0, width, height, "F")

  // Border
  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(3)
  doc.rect(10, 10, width - 20, height - 20)

  // Inner border
  doc.setDrawColor(147, 197, 253)
  doc.setLineWidth(1)
  doc.rect(15, 15, width - 30, height - 30)

  // Header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(37, 99, 235)
  doc.text("EDUPLATFORM", width / 2, 35, { align: "center" })

  // Title
  doc.setFontSize(36)
  doc.setTextColor(30, 41, 59)
  doc.text("CERTIFICADO DE FINALIZACION", width / 2, 55, { align: "center" })

  // Decorative line
  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.5)
  doc.line(width / 2 - 60, 62, width / 2 + 60, 62)

  // Body text
  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.setTextColor(71, 85, 105)
  doc.text("Se certifica que", width / 2, 80, { align: "center" })

  // Student name
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.setTextColor(30, 41, 59)
  doc.text(studentName, width / 2, 95, { align: "center" })

  // Course completion text
  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.setTextColor(71, 85, 105)
  doc.text("ha completado satisfactoriamente el curso", width / 2, 110, { align: "center" })

  // Course name
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(37, 99, 235)
  doc.text(courseName, width / 2, 125, { align: "center" })

  // Date
  const date = completionDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)
  doc.setTextColor(71, 85, 105)
  doc.text(`Fecha de emision: ${date}`, width / 2, 145, { align: "center" })

  // Certificate ID
  const certId = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  doc.setFontSize(10)
  doc.setTextColor(148, 163, 184)
  doc.text(`ID del Certificado: ${certId}`, width / 2, 155, { align: "center" })

  // Signature lines
  doc.setDrawColor(148, 163, 184)
  doc.setLineWidth(0.3)

  // Left signature
  doc.line(50, 175, 120, 175)
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text("Director Academico", 85, 182, { align: "center" })

  // Right signature
  doc.line(width - 120, 175, width - 50, 175)
  doc.text("Instructor del Curso", width - 85, 182, { align: "center" })

  // Download
  doc.save(`Certificado_${courseName.replace(/\s+/g, "_")}.pdf`)
}
