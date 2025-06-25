import { format, differenceInDays, addDays, isWeekend } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface CalendarResult {
  duration: number
  days: { dateFormatted: string; dayName: string; date: Date }[]
}

export interface CompensationResult {
  duration: number
  presentialDaysLost: number
  convertedDays: { weekNumber: number; dayName: string; dateFormatted: string; date: Date }[]
  totalConverted: number
  estimatedMonths: number
}

export interface ReportData {
  summary: {
    totalDays: number
    workDays: number
    weekendDays: number
    impactPercentage: number
  }
  insights: {
    title: string
    description: string
  }[]
  analytics: {
    dayDistribution: { [key: string]: number }
    weeklyPattern: number[]
  }
}

/**
 * Formats a Date object to pt-BR format (DD/MM/YYYY).
 */
export function formatDatePtBR(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: ptBR })
}

/**
 * Formats a Date object to long pt-BR format (e.g., "10 de maio de 2025").
 */
export function formatDateLong(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

/**
 * Formats a Date object to short pt-BR format with day name (e.g., "sáb, 10 de mai").
 */
export function formatDateShort(date: Date): string {
  return format(date, "eee, d 'de' MMM", { locale: ptBR })
}

/**
 * Gets the day name in Portuguese for a given Date object.
 */
function getDayNamePtBR(date: Date): string {
  return format(date, "EEEE", { locale: ptBR })
}

/**
 * Calculates the difference in days between two dates (inclusive).
 */
function getDaysDifference(start: Date, end: Date): number {
  return differenceInDays(end, start) + 1
}

/**
 * Generates a list of all days within a date range with pt-BR formatting.
 */
export function generateCalendarList(startDate: Date, endDate: Date): CalendarResult {
  const days = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    days.push({
      dateFormatted: formatDateLong(currentDate),
      dayName: getDayNamePtBR(currentDate),
      date: new Date(currentDate),
    })
    currentDate = addDays(currentDate, 1)
  }

  return {
    duration: getDaysDifference(startDate, endDate),
    days,
  }
}

/**
 * Counts how many "presential" days (Tue, Wed, Thu) are in a range.
 */
function countPresentialOff(startDate: Date, endDate: Date): number {
  let count = 0
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay() // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    if (dayOfWeek >= 2 && dayOfWeek <= 4) {
      count++
    }
    currentDate = addDays(currentDate, 1)
  }

  return count
}

/**
 * Counts work days (Mon-Fri) in a date range.
 */
function countWorkDays(startDate: Date, endDate: Date): number {
  let count = 0
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      count++
    }
    currentDate = addDays(currentDate, 1)
  }

  return count
}

/**
 * Counts weekend days in a date range.
 */
function countWeekendDays(startDate: Date, endDate: Date): number {
  let count = 0
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (isWeekend(currentDate)) {
      count++
    }
    currentDate = addDays(currentDate, 1)
  }

  return count
}

/**
 * Finds the next N Mondays or Fridays starting from a given date.
 */
function getConvertedDays(
  endDate: Date,
  lostCount: number,
): { weekNumber: number; dayName: string; dateFormatted: string; date: Date }[] {
  if (lostCount === 0) return []

  const converted = []
  let currentDate = addDays(endDate, 1) // Start from the day after return

  while (converted.length < lostCount) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek === 1 || dayOfWeek === 5) {
      // Monday or Friday
      const weekNumber = Math.ceil((converted.length + 1) / 2)
      converted.push({
        weekNumber,
        dayName: getDayNamePtBR(currentDate),
        dateFormatted: formatDateLong(currentDate),
        date: new Date(currentDate),
      })
    }
    currentDate = addDays(currentDate, 1)
  }

  return converted
}

/**
 * Calculates all compensation metrics based on start and end dates.
 */
export function calculateCompensation(startDate: Date, endDate: Date): CompensationResult {
  const presentialDaysLost = countPresentialOff(startDate, endDate)
  const convertedDays = getConvertedDays(endDate, presentialDaysLost)
  const totalConverted = convertedDays.length
  const weeks = Math.ceil(totalConverted / 2)
  const estimatedMonths = Math.ceil(weeks / 4)

  return {
    duration: getDaysDifference(startDate, endDate),
    presentialDaysLost,
    convertedDays,
    totalConverted,
    estimatedMonths,
  }
}

/**
 * Generates comprehensive report data with analytics and insights.
 */
export function generateReportData(mode: "calendar" | "compensation", startDate: Date, endDate: Date): ReportData {
  const totalDays = getDaysDifference(startDate, endDate)
  const workDays = countWorkDays(startDate, endDate)
  const weekendDays = countWeekendDays(startDate, endDate)
  const impactPercentage = Math.round((totalDays / 30) * 100)

  const insights = []

  if (mode === "calendar") {
    insights.push({
      title: "Período de Ausência Analisado",
      description: `Sua ausência durará ${totalDays} dias, incluindo ${workDays} dias úteis e ${weekendDays} dias de fim de semana.`,
    })

    if (workDays > 10) {
      insights.push({
        title: "Ausência Prolongada Detectada",
        description: "Considere dividir o período de ausência ou planejar a transição de responsabilidades.",
      })
    }

    if (weekendDays > workDays) {
      insights.push({
        title: "Otimização de Período",
        description:
          "Seu período inclui mais fins de semana que dias úteis, o que é eficiente para maximizar o tempo livre.",
      })
    }

    insights.push({
      title: "Análise Temporal",
      description: `O período inicia em ${formatDateLong(startDate)} e termina em ${formatDateLong(endDate)}, representando ${Math.round(totalDays / 7)} semana(s) completa(s).`,
    })
  } else {
    const compensation = calculateCompensation(startDate, endDate)

    insights.push({
      title: "Compensação Calculada",
      description: `Você precisará compensar ${compensation.presentialDaysLost} dias presenciais em aproximadamente ${compensation.estimatedMonths} mês(es).`,
    })

    if (compensation.estimatedMonths > 3) {
      insights.push({
        title: "Período de Compensação Longo",
        description: "O período de compensação é extenso. Considere negociar alternativas com a gestão.",
      })
    }

    insights.push({
      title: "Cronograma de Compensação",
      description: `As compensações serão distribuídas em ${Math.ceil(compensation.totalConverted / 2)} semanas, priorizando segundas e sextas-feiras.`,
    })

    if (compensation.convertedDays.length > 0) {
      const firstCompensation = compensation.convertedDays[0]
      const lastCompensation = compensation.convertedDays[compensation.convertedDays.length - 1]
      insights.push({
        title: "Período de Compensação",
        description: `A compensação iniciará em ${firstCompensation.dateFormatted} e terminará em ${lastCompensation.dateFormatted}.`,
      })
    }
  }

  return {
    summary: {
      totalDays,
      workDays,
      weekendDays,
      impactPercentage,
    },
    insights,
    analytics: {
      dayDistribution: {
        workDays,
        weekendDays,
      },
      weeklyPattern: [0, 1, 2, 3, 4, 5, 6].map((day) => {
        let count = 0
        let currentDate = new Date(startDate)
        while (currentDate <= endDate) {
          if (currentDate.getDay() === day) count++
          currentDate = addDays(currentDate, 1)
        }
        return count
      }),
    },
  }
}

/**
 * Exports report data in different formats with pt-BR formatting.
 */
export async function exportReport(
  mode: "calendar" | "compensation",
  startDate: Date,
  endDate: Date,
  format: "txt" | "json" | "csv",
): Promise<void> {
  const reportData = generateReportData(mode, startDate, endDate)
  let content = ""
  let filename = ""
  let mimeType = ""

  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: ptBR })

  switch (format) {
    case "txt":
      content = generateTextReport(mode, startDate, endDate, reportData)
      filename = `relatorio-ausencia_${timestamp}.txt`
      mimeType = "text/plain;charset=utf-8"
      break
    case "json":
      content = JSON.stringify(
        {
          mode,
          period: {
            start: formatDateLong(startDate),
            end: formatDateLong(endDate),
            startISO: startDate.toISOString(),
            endISO: endDate.toISOString(),
          },
          data: reportData,
          generatedAt: format(new Date(), "PPPPp", { locale: ptBR }),
          ...(mode === "calendar" ? { calendar: generateCalendarList(startDate, endDate) } : {}),
          ...(mode === "compensation" ? { compensation: calculateCompensation(startDate, endDate) } : {}),
        },
        null,
        2,
      )
      filename = `relatorio-ausencia_${timestamp}.json`
      mimeType = "application/json;charset=utf-8"
      break
    case "csv":
      content = generateCSVReport(mode, startDate, endDate)
      filename = `relatorio-ausencia_${timestamp}.csv`
      mimeType = "text/csv;charset=utf-8"
      break
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function generateTextReport(
  mode: "calendar" | "compensation",
  startDate: Date,
  endDate: Date,
  reportData: ReportData,
): string {
  let text = "=".repeat(60) + "\n"
  text += "           RELATÓRIO DE AUSÊNCIA E COMPENSAÇÃO\n"
  text += "=".repeat(60) + "\n\n"

  text += `Período: ${formatDateLong(startDate)} até ${formatDateLong(endDate)}\n`
  text += `Modo: ${mode === "calendar" ? "Visualização de Calendário" : "Cálculo de Compensação"}\n`
  text += `Gerado em: ${format(new Date(), "PPPPp", { locale: ptBR })}\n\n`

  text += "RESUMO EXECUTIVO\n"
  text += "-".repeat(30) + "\n"
  text += `• Total de dias: ${reportData.summary.totalDays}\n`
  text += `• Dias úteis: ${reportData.summary.workDays}\n`
  text += `• Fins de semana: ${reportData.summary.weekendDays}\n`
  text += `• Impacto mensal: ${reportData.summary.impactPercentage}%\n\n`

  if (mode === "calendar") {
    const calendar = generateCalendarList(startDate, endDate)
    text += "CALENDÁRIO DETALHADO\n"
    text += "-".repeat(30) + "\n"
    calendar.days.forEach((day) => {
      text += `${day.dateFormatted} — ${day.dayName}\n`
    })
  } else {
    const compensation = calculateCompensation(startDate, endDate)
    text += "CÁLCULO DE COMPENSAÇÃO\n"
    text += "-".repeat(30) + "\n"
    text += `Dias presenciais perdidos: ${compensation.presentialDaysLost}\n`
    text += `Total a compensar: ${compensation.totalConverted}\n`
    text += `Tempo estimado: ${compensation.estimatedMonths} mês(es)\n\n`

    text += "CRONOGRAMA DE COMPENSAÇÃO\n"
    text += "-".repeat(30) + "\n"
    compensation.convertedDays.forEach((day) => {
      text += `Semana ${day.weekNumber}: ${day.dayName} (${day.dateFormatted})\n`
    })
  }

  text += "\nINSIGHTS E RECOMENDAÇÕES\n"
  text += "-".repeat(30) + "\n"
  reportData.insights.forEach((insight, index) => {
    text += `${index + 1}. ${insight.title}\n`
    text += `   ${insight.description}\n\n`
  })

  return text
}

function generateCSVReport(mode: "calendar" | "compensation", startDate: Date, endDate: Date): string {
  let csv = ""

  if (mode === "calendar") {
    const calendar = generateCalendarList(startDate, endDate)
    csv = "Data,Dia da Semana,Tipo,Data Formatada\n"
    calendar.days.forEach((day) => {
      const isWeekendDay = isWeekend(day.date)
      csv += `${formatDatePtBR(day.date)},${day.dayName},${isWeekendDay ? "Fim de Semana" : "Dia Útil"},${day.dateFormatted}\n`
    })
  } else {
    const compensation = calculateCompensation(startDate, endDate)
    csv = "Semana,Data,Dia da Semana,Tipo,Data Formatada\n"
    compensation.convertedDays.forEach((day) => {
      csv += `${day.weekNumber},${formatDatePtBR(day.date)},${day.dayName},Compensação,${day.dateFormatted}\n`
    })
  }

  return csv
}
