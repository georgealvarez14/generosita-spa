'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export interface ServicioDataPoint {
  name: string
  value: number
}

interface Props {
  data: ServicioDataPoint[]
}

const COLORS = ['#9333ea', '#a855f7', '#7c3aed', '#c084fc', '#e879f9', '#6d28d9']

export default function ServiciosDonutChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-zinc-400 font-medium">
        Sin datos este mes
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #f3e8ff',
            boxShadow: '0 4px 20px rgba(147,51,234,0.08)',
            fontSize: '13px',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
