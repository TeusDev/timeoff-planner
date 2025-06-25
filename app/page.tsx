"use client"

import { useState, useMemo, useCallback } from "react"
import {
  CalendarIcon,
  ArrowLeft,
  Download,
  Building,
  CalendarDays,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ptBR } from "date-fns/locale"
import {
  formatDateLong,
  generateCalendarList,
  calculateCompensation,
  generateReportData,
  exportReport,
  type ReportData,
} from "@/lib/enhanced-date-logic"

type Mode = "calendar" | "compensation"
type Step = "home" | "startDate" | "endDate" | "result"

interface AnimationState {
  isAnimating: boolean
  direction: "forward" | "backward" | "none"
  fromStep: Step
  toStep: Step
}

export default function EnhancedAbsencePlannerPage() {
  const [step, setStep] = useState<Step>("home")
  const [mode, setMode] = useState<Mode | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    direction: "none",
    fromStep: "home",
    toStep: "home",
  })

  // Progress calculation based on actual step
  const progressValue = useMemo(() => {
    switch (step) {
      case "home":
        return 0
      case "startDate":
        return 33
      case "endDate":
        return 66
      case "result":
        return 100
      default:
        return 0
    }
  }, [step])

  const handleModeSelect = useCallback((selectedMode: Mode) => {
    performTransition("home", "startDate", "forward", () => {
      setMode(selectedMode)
    })
  }, [])

  const reset = useCallback(() => {
    performTransition(step, "home", "backward", () => {
      setMode(null)
      setStartDate(undefined)
      setEndDate(undefined)
    })
  }, [step])

  const handleStepTransition = useCallback(
    (nextStep: Step, direction: "forward" | "backward" = "forward") => {
      performTransition(step, nextStep, direction)
    },
    [step],
  )

  const performTransition = useCallback(
    (from: Step, to: Step, direction: "forward" | "backward", callback?: () => void) => {
      if (animationState.isAnimating || from === to) return

      // Start animation
      setAnimationState({
        isAnimating: true,
        direction,
        fromStep: from,
        toStep: to,
      })

      // Execute callback during animation if provided
      if (callback) {
        setTimeout(callback, 100)
      }

      // Complete transition
      setTimeout(() => {
        setStep(to)
        setAnimationState({
          isAnimating: false,
          direction: "none",
          fromStep: to,
          toStep: to,
        })
      }, 400)
    },
    [animationState.isAnimating],
  )

  const handleExportReport = async (format: "txt" | "json" | "csv") => {
    if (!startDate || !endDate || !mode) return
    await exportReport(mode, startDate, endDate, format)
  }

  const renderStep = () => {
    switch (step) {
      case "home":
        return <EnhancedHomeStep onSelect={handleModeSelect} isAnimating={animationState.isAnimating} />
      case "startDate":
        return (
          <EnhancedDateStep
            title="Data de Início da Ausência"
            subtitle="Selecione quando sua ausência começará"
            date={startDate}
            setDate={setStartDate}
            onNext={() => handleStepTransition("endDate", "forward")}
            onBack={() => handleStepTransition("home", "backward")}
            progress={progressValue}
            stepText="Etapa 1 de 3"
            isAnimating={animationState.isAnimating}
          />
        )
      case "endDate":
        return (
          <EnhancedDateStep
            title="Data de Retorno"
            subtitle="Selecione quando você retornará"
            date={endDate}
            setDate={setEndDate}
            onNext={() => handleStepTransition("result", "forward")}
            onBack={() => handleStepTransition("startDate", "backward")}
            progress={progressValue}
            stepText="Etapa 2 de 3"
            minDate={startDate}
            isAnimating={animationState.isAnimating}
          />
        )
      case "result":
        return (
          <EnhancedResultStep
            mode={mode!}
            startDate={startDate!}
            endDate={endDate!}
            onBack={() => handleStepTransition("home", "backward")}
            onExport={handleExportReport}
            isAnimating={animationState.isAnimating}
          />
        )
      default:
        return <EnhancedHomeStep onSelect={handleModeSelect} isAnimating={animationState.isAnimating} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div
            className={cn(
              "transition-all duration-400 ease-out transform-gpu",
              animationState.isAnimating && animationState.direction === "forward" && "animate-slide-out-left",
              animationState.isAnimating && animationState.direction === "backward" && "animate-slide-out-right",
              !animationState.isAnimating && "animate-slide-in opacity-100",
            )}
          >
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  )
}

function EnhancedHomeStep({ onSelect, isAnimating }: { onSelect: (mode: Mode) => void; isAnimating: boolean }) {
  return (
    <div className={cn("space-y-8", !isAnimating && "animate-fade-in-sequence")}>
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 animate-item delay-100">
          <CalendarDays className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent animate-item delay-200">
          Planejador de Ausência
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-item delay-300">
          Sistema inteligente para planejamento e compensação de ausências com análise detalhada e relatórios avançados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-item delay-400">
        <Card
          className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm transform-gpu"
          onClick={() => !isAnimating && onSelect("calendar")}
        >
          <CardHeader className="text-center space-y-4 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 transform-gpu">
              <CalendarDays className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <CardTitle className="text-2xl font-semibold transition-colors duration-300 group-hover:text-emerald-600">
              Visualização de Calendário
            </CardTitle>
            <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              Visualize todos os dias do período de ausência com detalhes completos e análise temporal
            </p>
            <div className="flex justify-center space-x-2 pt-2">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-200"
              >
                Visualização
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 transition-all duration-300 group-hover:bg-blue-200"
              >
                Análise
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card
          className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm transform-gpu"
          onClick={() => !isAnimating && onSelect("compensation")}
        >
          <CardHeader className="text-center space-y-4 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 transform-gpu">
              <Building className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <CardTitle className="text-2xl font-semibold transition-colors duration-300 group-hover:text-orange-600">
              Cálculo de Compensação
            </CardTitle>
            <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              Calcule automaticamente os dias de compensação necessários com relatórios detalhados
            </p>
            <div className="flex justify-center space-x-2 pt-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 transition-all duration-300 group-hover:bg-orange-200"
              >
                Cálculo
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 transition-all duration-300 group-hover:bg-purple-200"
              >
                Relatório
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-item delay-500">
        {[
          {
            icon: BarChart3,
            title: "Análise Avançada",
            desc: "Relatórios com insights detalhados",
            color: "blue",
          },
          {
            icon: TrendingUp,
            title: "Visualizações",
            desc: "Gráficos e métricas visuais",
            color: "green",
          },
          {
            icon: Download,
            title: "Exportação",
            desc: "Múltiplos formatos de relatório",
            color: "purple",
          },
        ].map((item, index) => (
          <div key={index} className={cn("text-center p-4 animate-item", `delay-${600 + index * 100}`)}>
            <div
              className={cn(
                "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all duration-300 hover:scale-110 hover:rotate-6 transform-gpu",
                item.color === "blue" && "bg-blue-100 hover:bg-blue-200",
                item.color === "green" && "bg-green-100 hover:bg-green-200",
                item.color === "purple" && "bg-purple-100 hover:bg-purple-200",
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-colors duration-300",
                  item.color === "blue" && "text-blue-600",
                  item.color === "green" && "text-green-600",
                  item.color === "purple" && "text-purple-600",
                )}
              />
            </div>
            <h3 className="font-semibold text-gray-900 transition-colors duration-300 hover:text-gray-700">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 transition-colors duration-300 hover:text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EnhancedDateStep({
  title,
  subtitle,
  date,
  setDate,
  onNext,
  onBack,
  progress,
  stepText,
  minDate,
  isAnimating,
}: {
  title: string
  subtitle: string
  date?: Date
  setDate: (date?: Date) => void
  onNext: () => void
  onBack: () => void
  progress: number
  stepText: string
  minDate?: Date
  isAnimating: boolean
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setTimeout(() => {
        setIsCalendarOpen(false)
      }, 150)
    }
  }

  return (
    <div className={cn("space-y-6", !isAnimating && "animate-fade-in-sequence")}>
      <div className="text-center space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isAnimating}
          className="mb-4 transition-all duration-300 hover:scale-105 hover:-translate-x-1 transform-gpu animate-item delay-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Voltar
        </Button>
        <h2 className="text-3xl font-bold text-gray-900 animate-item delay-200">{title}</h2>
        <p className="text-gray-600 animate-item delay-300">{subtitle}</p>
        <div className="flex items-center justify-center space-x-2 mt-4 animate-item delay-400">
          <span className="text-sm text-gray-500">{stepText}</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                transitionDelay: isAnimating ? "0ms" : "200ms",
              }}
            />
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm animate-item delay-500">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isAnimating}
                  className={cn(
                    "w-80 h-14 justify-start text-left font-normal text-lg border-2 transition-all duration-300 hover:scale-105 transform-gpu",
                    !date && "text-muted-foreground hover:border-blue-300",
                    date && "border-blue-500 bg-blue-50 hover:bg-blue-100 hover:border-blue-600 shadow-lg",
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 transition-transform duration-300 hover:scale-110" />
                  {date ? (
                    <span className="font-semibold">{formatDateLong(date)}</span>
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-2xl border-0 animate-scale-in-fast">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={minDate ? (d) => d <= minDate : undefined}
                  locale={ptBR}
                  className="rounded-lg"
                  formatters={{
                    formatCaption: (date) => {
                      return date.toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })
                    },
                    formatWeekdayName: (date) => {
                      return date.toLocaleDateString("pt-BR", {
                        weekday: "short",
                      })
                    },
                  }}
                />
              </PopoverContent>
            </Popover>

            {date && (
              <div className="text-center space-y-2 animate-fade-in-fast">
                <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
                  Data selecionada: {formatDateLong(date)}
                </Badge>
              </div>
            )}

            <div className="flex space-x-4 pt-4 animate-item delay-600">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isAnimating}
                size="lg"
                className="transition-all duration-300 hover:scale-105 hover:-translate-x-1 transform-gpu"
              >
                Voltar
              </Button>
              <Button
                onClick={onNext}
                disabled={!date || isAnimating}
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform-gpu",
                  date && !isAnimating ? "hover:scale-105 hover:shadow-lg" : "opacity-50 cursor-not-allowed",
                )}
              >
                Continuar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EnhancedResultStep({
  mode,
  startDate,
  endDate,
  onBack,
  onExport,
  isAnimating,
}: {
  mode: Mode
  startDate: Date
  endDate: Date
  onBack: () => void
  onExport: (format: "txt" | "json" | "csv") => void
  isAnimating: boolean
}) {
  const reportData = useMemo<ReportData>(() => {
    return generateReportData(mode, startDate, endDate)
  }, [mode, startDate, endDate])

  const calendarResult = mode === "calendar" ? generateCalendarList(startDate, endDate) : null
  const compensationResult = mode === "compensation" ? calculateCompensation(startDate, endDate) : null

  return (
    <div className={cn("space-y-6", !isAnimating && "animate-fade-in-sequence")}>
      {/* Header */}
      <div className="flex items-center justify-between animate-item delay-100">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isAnimating}
          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:-translate-x-1 transform-gpu"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Nova Consulta</span>
        </Button>
        <div className="flex space-x-2">
          {["txt", "csv", "json"].map((format, index) => (
            <Button
              key={format}
              variant="outline"
              onClick={() => onExport(format as "txt" | "csv" | "json")}
              disabled={isAnimating}
              className={cn(
                "transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu animate-item",
                `delay-${200 + index * 50}`,
              )}
            >
              <Download className="h-4 w-4 mr-2 transition-transform duration-300 hover:scale-110" />
              {format.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-item delay-300">
        {[
          {
            icon: CalendarDays,
            label: "Duração Total",
            value: `${reportData.summary.totalDays} dias`,
            gradient: "from-blue-500 to-blue-600",
          },
          {
            icon: Users,
            label: "Dias Úteis",
            value: `${reportData.summary.workDays} dias`,
            gradient: "from-emerald-500 to-emerald-600",
          },
          {
            icon: Clock,
            label: "Fins de Semana",
            value: `${reportData.summary.weekendDays} dias`,
            gradient: "from-orange-500 to-orange-600",
          },
          {
            icon: TrendingUp,
            label: "Impacto",
            value: `${reportData.summary.impactPercentage}%`,
            gradient: "from-purple-500 to-purple-600",
          },
        ].map((card, index) => (
          <Card
            key={index}
            className={cn(
              "border-0 bg-gradient-to-r text-white hover:scale-105 transition-transform transform-gpu animate-item",
              card.gradient,
              `delay-${400 + index * 100}`,
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <card.icon className="h-8 w-8" />
                <div>
                  <p className="text-white/80 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6 animate-item delay-800">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="transition-all duration-300 hover:scale-105">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="details" className="transition-all duration-300 hover:scale-105">
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="transition-all duration-300 hover:scale-105">
            Análise
          </TabsTrigger>
          <TabsTrigger value="insights" className="transition-all duration-300 hover:scale-105">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in-fast">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5" />
                <span>Resumo do Período</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] transform-gpu">
                  <span className="font-medium">Período de Ausência:</span>
                  <span className="font-semibold">
                    {formatDateLong(startDate)} até {formatDateLong(endDate)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 transform-gpu">
                    <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalDays}</p>
                    <p className="text-sm text-gray-600">Dias Totais</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 transform-gpu">
                    <p className="text-2xl font-bold text-emerald-600">{reportData.summary.workDays}</p>
                    <p className="text-sm text-gray-600">Dias Úteis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6 animate-fade-in-fast">
          {mode === "calendar" && calendarResult && (
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Calendário Detalhado</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-2">
                    {calendarResult.days.map((day, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-sm transform-gpu"
                      >
                        <span className="font-mono font-medium">{day.dateFormatted}</span>
                        <Badge
                          variant={
                            day.dayName.includes("sábado") || day.dayName.includes("domingo") ? "secondary" : "default"
                          }
                          className="transition-all duration-300 hover:scale-105"
                        >
                          {day.dayName}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {mode === "compensation" && compensationResult && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Cálculo de Compensação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          value: compensationResult.presentialDaysLost,
                          label: "Dias Presenciais Perdidos",
                          color: "red",
                        },
                        {
                          value: compensationResult.totalConverted,
                          label: "Dias a Compensar",
                          color: "blue",
                        },
                        {
                          value: compensationResult.estimatedMonths,
                          label: "Meses Estimados",
                          color: "green",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={cn(
                            "text-center p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md transform-gpu",
                            item.color === "red" && "bg-red-50",
                            item.color === "blue" && "bg-blue-50",
                            item.color === "green" && "bg-green-50",
                          )}
                        >
                          <p
                            className={cn(
                              "text-2xl font-bold",
                              item.color === "red" && "text-red-600",
                              item.color === "blue" && "text-blue-600",
                              item.color === "green" && "text-green-600",
                            )}
                          >
                            {item.value}
                          </p>
                          <p className="text-sm text-gray-600">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Cronograma de Compensação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 w-full">
                    <div className="space-y-2">
                      {compensationResult.convertedDays.map((day, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-sm transform-gpu"
                        >
                          <span className="font-medium">Semana {day.weekNumber}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{day.dateFormatted}</span>
                            <Badge variant="outline" className="transition-all duration-300 hover:scale-105">
                              {day.dayName}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 animate-fade-in-fast">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Dias Úteis</span>
                      <span className="font-semibold">{reportData.summary.workDays}</span>
                    </div>
                    <Progress
                      value={(reportData.summary.workDays / reportData.summary.totalDays) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Fins de Semana</span>
                      <span className="font-semibold">{reportData.summary.weekendDays}</span>
                    </div>
                    <Progress
                      value={(reportData.summary.weekendDays / reportData.summary.totalDays) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Métricas de Impacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg transition-all duration-300 hover:scale-105 transform-gpu">
                    <p className="text-3xl font-bold text-blue-600">{reportData.summary.impactPercentage}%</p>
                    <p className="text-sm text-gray-600">Impacto no Mês</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="transition-all duration-300 hover:scale-105 transform-gpu">
                      <p className="text-lg font-semibold">{Math.round(reportData.summary.totalDays / 7)}</p>
                      <p className="text-xs text-gray-600">Semanas</p>
                    </div>
                    <div className="transition-all duration-300 hover:scale-105 transform-gpu">
                      <p className="text-lg font-semibold">{Math.ceil(reportData.summary.totalDays / 30)}</p>
                      <p className="text-xs text-gray-600">Meses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6 animate-fade-in-fast">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Insights e Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg transition-all duration-300 hover:bg-blue-100 hover:scale-[1.02] hover:shadow-md transform-gpu"
                  >
                    <p className="font-medium text-blue-900">{insight.title}</p>
                    <p className="text-blue-700 text-sm mt-1">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
