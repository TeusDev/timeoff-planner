"use client"

import { useState, useMemo } from "react"
import { CalendarIcon, ArrowLeft, Download, Building, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  formatDate,
  generateCalendarList,
  calculateCompensation,
  generateResultText,
  type CompensationResult,
  type CalendarResult,
} from "@/lib/date-logic"

type Mode = "calendar" | "compensation"
type Step = "home" | "startDate" | "endDate" | "result"

export default function AbsencePlannerPage() {
  const [step, setStep] = useState<Step>("home")
  const [mode, setMode] = useState<Mode | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode)
    setStep("startDate")
  }

  const reset = () => {
    setStep("home")
    setMode(null)
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const handleSaveResult = () => {
    if (!startDate || !endDate || !mode) return
    const textContent = generateResultText(mode, startDate, endDate)
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "planejamento-ausencia.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const renderStep = () => {
    switch (step) {
      case "home":
        return <HomeStep onSelect={handleModeSelect} />
      case "startDate":
        return (
          <DateStep
            title="Data de ida"
            date={startDate}
            setDate={setStartDate}
            onNext={() => setStep("endDate")}
            onBack={reset}
            progress="Passo 2 de 3"
          />
        )
      case "endDate":
        return (
          <DateStep
            title="Data de retorno"
            date={endDate}
            setDate={setEndDate}
            onNext={() => setStep("result")}
            onBack={() => setStep("startDate")}
            progress="Passo 2 de 3"
            minDate={startDate}
          />
        )
      case "result":
        return (
          <ResultStep mode={mode!} startDate={startDate!} endDate={endDate!} onBack={reset} onSave={handleSaveResult} />
        )
      default:
        return <HomeStep onSelect={handleModeSelect} />
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">{renderStep()}</div>
    </div>
  )
}

function HomeStep({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <div className="text-center">
      <h1 className="mb-8 text-3xl font-bold">👨‍💻 Planejador de Ausência e Compensação</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="cursor-pointer transition-transform hover:scale-105" onClick={() => onSelect("calendar")}>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2 text-2xl">
              <CalendarDays className="h-10 w-10" />
              <span>Calendário</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer transition-transform hover:scale-105" onClick={() => onSelect("compensation")}>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2 text-2xl">
              <Building className="h-10 w-10" />
              <span>Compensação</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

function DateStep({
  title,
  date,
  setDate,
  onNext,
  onBack,
  progress,
  minDate,
}: {
  title: string
  date?: Date
  setDate: (date?: Date) => void
  onNext: () => void
  onBack: () => void
  progress: string
  minDate?: Date
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{title}</CardTitle>
          <span className="text-sm text-muted-foreground">{progress}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date) : <span>DD-MM-AAAA</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={minDate ? (d) => d <= minDate : undefined}
              locale={{
                localize: {
                  month: (n) =>
                    [
                      "Janeiro",
                      "Fevereiro",
                      "Março",
                      "Abril",
                      "Maio",
                      "Junho",
                      "Julho",
                      "Agosto",
                      "Setembro",
                      "Outubro",
                      "Novembro",
                      "Dezembro",
                    ][n],
                  day: (n) => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][n],
                },
                formatLong: {},
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={onNext} disabled={!date}>
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultStep({
  mode,
  startDate,
  endDate,
  onBack,
  onSave,
}: {
  mode: Mode
  startDate: Date
  endDate: Date
  onBack: () => void
  onSave: () => void
}) {
  const calendarResult = useMemo<CalendarResult | null>(() => {
    if (mode === "calendar") {
      return generateCalendarList(startDate, endDate)
    }
    return null
  }, [mode, startDate, endDate])

  const compensationResult = useMemo<CompensationResult | null>(() => {
    if (mode === "compensation") {
      return calculateCompensation(startDate, endDate)
    }
    return null
  }, [mode, startDate, endDate])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex-grow text-center">Resultado</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {mode === "calendar" && calendarResult && (
          <div className="space-y-4">
            <h2 className="text-center text-lg font-semibold">
              📅 Período: {formatDate(startDate)} até {formatDate(endDate)} ({calendarResult.duration} dias)
            </h2>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <ul className="space-y-2">
                {calendarResult.days.map((day, index) => (
                  <li key={index} className="font-mono">
                    {day.date} — {day.dayName}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
        {mode === "compensation" && compensationResult && (
          <div className="space-y-6">
            <div className="rounded-md border p-4 text-center">
              <p>
                🗓️ Ausência: {formatDate(startDate)} → {formatDate(endDate)}
              </p>
              <p>⏳ Duração: {compensationResult.duration} dias</p>
              <p>📌 Dias presenciais perdidos: {compensationResult.presentialDaysLost}</p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Dias convertidos</h3>
              <ScrollArea className="h-60 w-full rounded-md border p-4">
                <ul className="space-y-2">
                  {compensationResult.convertedDays.map((day, index) => (
                    <li key={index} className="font-mono">
                      • Semana {day.weekNumber}: {day.dayName} ({day.date})
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="rounded-md bg-muted p-4 text-center font-semibold">
              <p>🔁 Total convertidos: {compensationResult.totalConverted}</p>
              <p>📆 Tempo estimado: {compensationResult.estimatedMonths} mês(es)</p>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onBack}>
            Voltar ao Início
          </Button>
          <Button onClick={onSave}>
            <Download className="mr-2 h-4 w-4" />
            Salvar Resultado
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
