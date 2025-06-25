"use client"

import { useState, useMemo } from "react"
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

export default function EnhancedAbsencePlannerPage() {
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

  const handleExportReport = async (format: "txt" | "json" | "csv") => {
    if (!startDate || !endDate || !mode) return
    await exportReport(mode, startDate, endDate, format)
  }

  const renderStep = () => {
    switch (step) {
      case "home":
        return <EnhancedHomeStep onSelect={handleModeSelect} />
      case "startDate":
        return (
          <EnhancedDateStep
            title="Data de Início da Ausência"
            subtitle="Selecione quando sua ausência começará"
            date={startDate}
            setDate={setStartDate}
            onNext={() => setStep("endDate")}
            onBack={reset}
            progress={33}
            stepText="Etapa 1 de 3"
          />
        )
      case "endDate":
        return (
          <EnhancedDateStep
            title="Data de Retorno"
            subtitle="Selecione quando você retornará"
            date={endDate}
            setDate={setEndDate}
            onNext={() => setStep("result")}
            onBack={() => setStep("startDate")}
            progress={66}
            stepText="Etapa 2 de 3"
            minDate={startDate}
          />
        )
      case "result":
        return (
          <EnhancedResultStep
            mode={mode!}
            startDate={startDate!}
            endDate={endDate!}
            onBack={reset}
            onExport={handleExportReport}
          />
        )
      default:
        return <EnhancedHomeStep onSelect={handleModeSelect} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">{renderStep()}</div>
      </div>
    </div>
  )
}

function EnhancedHomeStep({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
          <CalendarDays className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Planejador de Ausência
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sistema inteligente para planejamento e compensação de ausências com análise detalhada e relatórios avançados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm"
          onClick={() => onSelect("calendar")}
        >
          <CardHeader className="text-center space-y-4 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">Visualização de Calendário</CardTitle>
            <p className="text-gray-600">
              Visualize todos os dias do período de ausência com detalhes completos e análise temporal
            </p>
            <div className="flex justify-center space-x-2 pt-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                Visualização
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Análise
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card
          className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm"
          onClick={() => onSelect("compensation")}
        >
          <CardHeader className="text-center space-y-4 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
              <Building className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">Cálculo de Compensação</CardTitle>
            <p className="text-gray-600">
              Calcule automaticamente os dias de compensação necessários com relatórios detalhados
            </p>
            <div className="flex justify-center space-x-2 pt-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Cálculo
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Relatório
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="text-center p-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Análise Avançada</h3>
          <p className="text-sm text-gray-600 mt-1">Relatórios com insights detalhados</p>
        </div>
        <div className="text-center p-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Visualizações</h3>
          <p className="text-sm text-gray-600 mt-1">Gráficos e métricas visuais</p>
        </div>
        <div className="text-center p-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
            <Download className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Exportação</h3>
          <p className="text-sm text-gray-600 mt-1">Múltiplos formatos de relatório</p>
        </div>
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
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <span className="text-sm text-gray-500">{stepText}</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-80 h-14 justify-start text-left font-normal text-lg border-2 transition-all duration-200",
                    !date && "text-muted-foreground",
                    date && "border-blue-500 bg-blue-50",
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {date ? (
                    <span className="font-semibold">{formatDateLong(date)}</span>
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-xl border-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
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
              <div className="text-center space-y-2 animate-in fade-in duration-300">
                <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
                  Data selecionada: {formatDateLong(date)}
                </Badge>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button variant="outline" onClick={onBack} size="lg">
                Voltar
              </Button>
              <Button
                onClick={onNext}
                disabled={!date}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
}: {
  mode: Mode
  startDate: Date
  endDate: Date
  onBack: () => void
  onExport: (format: "txt" | "json" | "csv") => void
}) {
  const reportData = useMemo<ReportData>(() => {
    return generateReportData(mode, startDate, endDate)
  }, [mode, startDate, endDate])

  const calendarResult = mode === "calendar" ? generateCalendarList(startDate, endDate) : null
  const compensationResult = mode === "compensation" ? calculateCompensation(startDate, endDate) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Nova Consulta</span>
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onExport("txt")}>
            <Download className="h-4 w-4 mr-2" />
            TXT
          </Button>
          <Button variant="outline" onClick={() => onExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => onExport("json")}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CalendarDays className="h-8 w-8" />
              <div>
                <p className="text-blue-100 text-sm">Duração Total</p>
                <p className="text-2xl font-bold">{reportData.summary.totalDays} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8" />
              <div>
                <p className="text-emerald-100 text-sm">Dias Úteis</p>
                <p className="text-2xl font-bold">{reportData.summary.workDays} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8" />
              <div>
                <p className="text-orange-100 text-sm">Fins de Semana</p>
                <p className="text-2xl font-bold">{reportData.summary.weekendDays} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8" />
              <div>
                <p className="text-purple-100 text-sm">Impacto</p>
                <p className="text-2xl font-bold">{reportData.summary.impactPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5" />
                <span>Resumo do Período</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Período de Ausência:</span>
                  <span className="font-semibold">
                    {formatDateLong(startDate)} até {formatDateLong(endDate)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalDays}</p>
                    <p className="text-sm text-gray-600">Dias Totais</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">{reportData.summary.workDays}</p>
                    <p className="text-sm text-gray-600">Dias Úteis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {mode === "calendar" && calendarResult && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Calendário Detalhado</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-2">
                    {calendarResult.days.map((day, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="font-mono font-medium">{day.dateFormatted}</span>
                        <Badge
                          variant={
                            day.dayName.includes("sábado") || day.dayName.includes("domingo") ? "secondary" : "default"
                          }
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
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Cálculo de Compensação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{compensationResult.presentialDaysLost}</p>
                        <p className="text-sm text-gray-600">Dias Presenciais Perdidos</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{compensationResult.totalConverted}</p>
                        <p className="text-sm text-gray-600">Dias a Compensar</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{compensationResult.estimatedMonths}</p>
                        <p className="text-sm text-gray-600">Meses Estimados</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Cronograma de Compensação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 w-full">
                    <div className="space-y-2">
                      {compensationResult.convertedDays.map((day, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span className="font-medium">Semana {day.weekNumber}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{day.dateFormatted}</span>
                            <Badge variant="outline">{day.dayName}</Badge>
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
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

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Métricas de Impacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{reportData.summary.impactPercentage}%</p>
                    <p className="text-sm text-gray-600">Impacto no Mês</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{Math.round(reportData.summary.totalDays / 7)}</p>
                      <p className="text-xs text-gray-600">Semanas</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{Math.ceil(reportData.summary.totalDays / 30)}</p>
                      <p className="text-xs text-gray-600">Meses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Insights e Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.insights.map((insight, index) => (
                  <div key={index} className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
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
