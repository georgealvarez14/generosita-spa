import type React from 'react'
import type { ModalidadServicio } from '@prisma/client'

export type { ModalidadServicio }

// ─── Database model types ─────────────────────────────────────────────────────

export interface ServicioRecord {
  id: string
  nombre: string
  precio: number
  duracion: number
  modalidad: ModalidadServicio
  recargo_domicilio: number | null
  created_at?: Date | null
}

export interface ClienteRecord {
  id: string
  nombre: string
  telefono: string
  email: string | null
  rol: string | null
  password?: string | null
  created_at?: Date | null
}

export interface EstadoCitaRecord {
  id: number
  nombre: string
}

export interface CitaRecord {
  id: string
  fecha: Date
  hora: Date
  cliente_id: string
  empleado_id?: string | null
  estado_id: number | null
  notas: string | null
  precio_ajustado: number | null
  modalidad: ModalidadServicio
  direccion_domicilio: string | null
  indicaciones: string | null
  created_at?: Date | null
}

export interface CitaConServicios extends CitaRecord {
  servicios: ServicioRecord[]
}

export interface CitaConRelaciones extends CitaRecord {
  cliente: ClienteRecord
  servicios: ServicioRecord[]
  estado?: EstadoCitaRecord | null
}

// ─── DTO types (serialized for API responses — dates as strings) ──────────────

export interface ServicioDTO {
  id: string
  nombre: string
  precio: number
  duracion: number
  modalidad: ModalidadServicio
  recargo_domicilio: number | null
}

export interface ClienteDTO {
  id: string
  nombre: string
  telefono: string
  email: string | null
  rol?: string | null
}

export interface CitaDTO {
  id: string
  fecha: string   // YYYY-MM-DD
  hora: string    // HH:mm
  estado_id: number | null
  notas: string | null
  precio_ajustado: number | null
  modalidad: ModalidadServicio
  direccion_domicilio: string | null
  indicaciones: string | null
  cliente: ClienteDTO
  servicios: ServicioDTO[]
}

// ─── UI component props ───────────────────────────────────────────────────────

export interface InputFieldProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface StatsResponse {
  totalCitas: number
  citasHoy: number
  pendientes: number
  totalClientes: number
  totalServicios: number
  ingresos: { hoy: number; semana: number; mes: number }
}

export interface AvailabilityResponse {
  ocupacionesPorDia: Record<string, { startMin: number; endMin: number }[]>
}
