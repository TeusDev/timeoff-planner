export interface CalendarResult {
  duration: number
  days: { date: string; dayName: string }[]
}

export interface CompensationResult {
  duration: number
  presentialDaysLost: number
  convertedDays: { weekNumber: number; dayName: string; date: string }[]
  totalConverted: number
  estimatedMonths: number
}

const ptBRDayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

/**
 * Formats a Date object to DD-MM-YYYY string.
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

/**
 * Gets the day name in Portuguese for a given Date object.
 */
function getDayName(date: Date): string {
  return ptBRDayNames[date.getDay()]
}

/**
 * Calculates the difference in days between two dates.
 */
function getDaysDifference(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

/**
 * Generates a list of all days within a date range.
 */
export function generateCalendarList(startDate: Date, endDate: Date): CalendarResult {
  const days = []
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    days.push({
      date: formatDate(currentDate),
      dayName: getDayName(currentDate),
    })
    currentDate.setDate(currentDate.getDate() + 1)
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
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay() // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    if (dayOfWeek >= 2 && dayOfWeek <= 4) {
      count++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return count
}

/**
 * Finds the next N Mondays or Fridays starting from a given date.
 */
function getConvertedDays(endDate: Date, lostCount: number): { weekNumber: number; dayName: string; date: string }[] {
  if (lostCount === 0) return []

  const converted = []
  const currentDate = new Date(endDate)
  currentDate.setDate(currentDate.getDate() + 1) // Start from the day after return

  while (converted.length < lostCount) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek === 1 || dayOfWeek === 5) {
      // Monday or Friday
      const weekNumber = Math.ceil((converted.length + 1) / 2)
      converted.push({
        weekNumber,
        dayName: getDayName(currentDate),
        date: formatDate(currentDate),
      })
    }
    currentDate.setDate(currentDate.getDate() + 1)
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
 * Generates the full text content for the .txt file download.
 */
export function generateResultText(mode: "calendar" | "compensation", startDate: Date, endDate: Date): string {
  if (mode === "calendar") {
    const result = generateCalendarList(startDate, endDate)
    let text = `📅 Período: ${formatDate(startDate)} até ${formatDate(endDate)} (${result.duration} dias)\n`
    text += "----------------------------------------\n"
    result.days.forEach((day) => {
      text += `${day.date} — ${day.dayName}\n`
    })
    return text
  } else {
    const result = calculateCompensation(startDate, endDate)
    let text = `🗓️ Ausência: ${formatDate(startDate)} → ${formatDate(endDate)}\n`
    text += `⏳ Duração: ${result.duration} dias\n`
    text += `📌 Dias presenciais perdidos: ${result.presentialDaysLost}\n\n`
    text += "--- Dias convertidos ---\n"
    result.convertedDays.forEach((day) => {
      text += `• Semana ${day.weekNumber}: ${day.dayName} (${day.date})\n`
    })
    text += "\n--- Resumo final ---\n"
    text += `🔁 Total convertidos: ${result.totalConverted}\n`
    text += `📆 Tempo estimado: ${result.estimatedMonths} mês(es)\n`
    return text
  }
}
