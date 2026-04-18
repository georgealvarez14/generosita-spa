'use client'

import dynamic from 'next/dynamic'

function ChartSkeleton() {
  return <div className="h-[280px] animate-pulse bg-purple-50 rounded-2xl" />
}

export const IngresosAreaChart = dynamic(
  () => import('@/components/admin/charts/IngresosAreaChart'),
  { ssr: false, loading: ChartSkeleton },
)

export const ServiciosDonutChart = dynamic(
  () => import('@/components/admin/charts/ServiciosDonutChart'),
  { ssr: false, loading: ChartSkeleton },
)
