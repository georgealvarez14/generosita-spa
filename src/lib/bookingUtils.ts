// Time and date utilities for the booking system.
// Centralises timezone-safe date handling shared by availability and bookings routes.

export function parseTimeToMinutes(horaStr: string): number {
  const [h, m] = horaStr.split(':').map(Number)
  return h * 60 + m
}

export function formatHoraFromDate(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export function formatFechaFromDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Extracts YYYY-MM-DD from a DATE column value returned by Prisma.
// DATE columns arrive as midnight UTC; getUTC* prevents off-by-one errors
// on servers running in non-UTC timezones.
export function getUTCDateKey(date: Date): string {
  const y = date.getUTCFullYear()
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dy = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${mo}-${dy}`
}

// Stores fecha at noon UTC so the calendar date never shifts backward
// when PostgreSQL converts the timestamp to a DATE column.
export function createNoonUTCDate(fechaStr: string): Date {
  return new Date(new Date(fechaStr.split('T')[0]).getTime() + 12 * 60 * 60 * 1000)
}

export function isTimeOverlapping(
  reqStartMin: number,
  reqEndMin: number,
  existingStartMin: number,
  existingEndMin: number,
): boolean {
  return reqStartMin < existingEndMin && reqEndMin > existingStartMin
}

export function parsePrecioAjustado(value: string | number | null | undefined): number | null {
  if (value === '' || value === null || value === undefined || isNaN(Number(value))) {
    return null
  }
  return Number(value)
}
