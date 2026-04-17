'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export interface IngresosDataPoint {
  dia: string
  Ingresos: number
  Citas: number
}

interface Props {
  data: IngresosDataPoint[]
}

export default function IngresosAreaChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
        <XAxis
          dataKey="dia"
          tick={{ fontSize: 12, fill: '#a1a1aa' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#a1a1aa' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${v.toLocaleString()}`}
          width={70}
        />
        <Tooltip
          formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, 'Ingresos']}
          labelFormatter={(label) => `Día ${String(label)}`}
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #f3e8ff',
            boxShadow: '0 4px 20px rgba(147,51,234,0.08)',
            fontSize: '13px',
          }}
        />
        <Area
          type="monotone"
          dataKey="Ingresos"
          stroke="#9333ea"
          strokeWidth={2.5}
          fill="url(#gradIngresos)"
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0, fill: '#9333ea' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
