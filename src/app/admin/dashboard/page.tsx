import { TrendingUp, CalendarCheck, CalendarX, Users, DollarSign } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getUTCDateKey } from '@/lib/bookingUtils'
import type { CitaConServicios } from '@/types'
import type { IngresosDataPoint } from '@/components/admin/charts/IngresosAreaChart'
import type { ServicioDataPoint } from '@/components/admin/charts/ServiciosDonutChart'
import {
  IngresosAreaChart,
  ServiciosDonutChart,
} from '@/components/admin/charts/ChartWrappers'

// estado_id 3 = Cancelada (excluded from revenue)
const CANCELADA_ID = 3

export default async function DashboardPage() {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const inicioMes = new Date(Date.UTC(year, month, 1))
  const finMes = new Date(Date.UTC(year, month + 1, 1))

  const [citasMes, nuevasClientas] = await Promise.all([
    prisma.cita.findMany({
      where: { fecha: { gte: inicioMes, lt: finMes } },
      include: { servicios: true },
    }) as unknown as Promise<CitaConServicios[]>,
    prisma.cliente.count({
      where: {
        created_at: { gte: inicioMes },
        OR: [{ rol: 'cliente' }, { rol: null }],
      },
    }),
  ])

  // ── KPI computation ──────────────────────────────────────────────────────────
  let ingresosMes = 0
  let citasCompletadas = 0
  let citasCanceladas = 0

  const ingresosPorDia: Record<string, number> = {}
  const citasPorDia: Record<string, number> = {}
  const conteoPorServicio: Record<string, number> = {}

  for (const cita of citasMes) {
    const dateKey = getUTCDateKey(cita.fecha)
    const isCancelled = cita.estado_id === CANCELADA_ID
    const basePrice = cita.servicios.reduce((acc, s) => acc + Number(s.precio), 0)
    const precioFinal = basePrice - (cita.precio_ajustado ?? 0)

    if (isCancelled) {
      citasCanceladas++
    } else {
      citasCompletadas++
      ingresosMes += precioFinal
      ingresosPorDia[dateKey] = (ingresosPorDia[dateKey] ?? 0) + precioFinal
      citasPorDia[dateKey] = (citasPorDia[dateKey] ?? 0) + 1

      for (const s of cita.servicios) {
        conteoPorServicio[s.nombre] = (conteoPorServicio[s.nombre] ?? 0) + 1
      }
    }
  }

  const ticketPromedio =
    citasCompletadas > 0 ? Math.round(ingresosMes / citasCompletadas) : 0

  // ── Area chart: one point per day in month ───────────────────────────────────
  const areaData: IngresosDataPoint[] = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    return {
      dia: String(dayNum),
      Ingresos: ingresosPorDia[dateKey] ?? 0,
      Citas: citasPorDia[dateKey] ?? 0,
    }
  })

  // ── Donut chart: top 6 services by booking count ─────────────────────────────
  const donutData: ServicioDataPoint[] = Object.entries(conteoPorServicio)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }))

  const mesNombre = inicioMes.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const kpis = [
    {
      label: 'Ingresos del Mes',
      value: `$${ingresosMes.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Citas Activas',
      value: citasCompletadas,
      icon: CalendarCheck,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Canceladas',
      value: citasCanceladas,
      icon: CalendarX,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Ticket Promedio',
      value: `$${ticketPromedio.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Nuevas Clientas',
      value: nuevasClientas,
      icon: Users,
      color: 'bg-pink-100 text-pink-700',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-brand-dark tracking-tight">
          Dashboard
        </h1>
        <p className="text-brand-light font-medium text-sm mt-1 capitalize">{mesNombre}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-3xl border border-purple-50/50 p-5 flex flex-col gap-3 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-dark tracking-tight">{value}</p>
              <p className="text-xs text-zinc-500 font-semibold mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area chart — takes 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-purple-50/50 p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-dark font-outfit mb-1">
            Ingresos diarios
          </h2>
          <p className="text-xs text-zinc-400 font-medium mb-5">Solo citas no canceladas</p>
          <IngresosAreaChart data={areaData} />
        </div>

        {/* Donut chart — 1/3 width */}
        <div className="bg-white rounded-3xl border border-purple-50/50 p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-dark font-outfit mb-1">
            Servicios más pedidos
          </h2>
          <p className="text-xs text-zinc-400 font-medium mb-5">Top 6 del mes</p>
          <ServiciosDonutChart data={donutData} />
        </div>
      </div>
    </div>
  )
}
