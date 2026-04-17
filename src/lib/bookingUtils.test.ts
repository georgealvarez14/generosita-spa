import { describe, it, expect } from 'vitest'
import {
  parseTimeToMinutes,
  formatHoraFromDate,
  formatFechaFromDate,
  getUTCDateKey,
  createNoonUTCDate,
  isTimeOverlapping,
  parsePrecioAjustado,
} from './bookingUtils'

// ─── parseTimeToMinutes ───────────────────────────────────────────────────────

describe('parseTimeToMinutes', () => {
  it('convierte medianoche correctamente', () => {
    expect(parseTimeToMinutes('00:00')).toBe(0)
  })

  it('convierte inicio de jornada laboral', () => {
    expect(parseTimeToMinutes('09:00')).toBe(540)
  })

  it('convierte mediodía', () => {
    expect(parseTimeToMinutes('12:00')).toBe(720)
  })

  it('convierte hora con minutos no redondos', () => {
    expect(parseTimeToMinutes('12:30')).toBe(750)
    expect(parseTimeToMinutes('09:15')).toBe(555)
    expect(parseTimeToMinutes('18:45')).toBe(1125)
  })

  it('convierte fin de jornada laboral', () => {
    expect(parseTimeToMinutes('19:00')).toBe(1140)
  })

  it('convierte último minuto del día', () => {
    expect(parseTimeToMinutes('23:59')).toBe(1439)
  })
})

// ─── formatHoraFromDate ───────────────────────────────────────────────────────

describe('formatHoraFromDate', () => {
  // Usamos setHours (hora local) porque getHours también es local
  const hora = (h: number, m: number) => {
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
  }

  it('formatea medianoche con doble cero', () => {
    expect(formatHoraFromDate(hora(0, 0))).toBe('00:00')
  })

  it('añade cero inicial a horas de un dígito', () => {
    expect(formatHoraFromDate(hora(9, 0))).toBe('09:00')
  })

  it('añade cero inicial a minutos de un dígito', () => {
    expect(formatHoraFromDate(hora(10, 5))).toBe('10:05')
  })

  it('formatea hora PM sin modificación', () => {
    expect(formatHoraFromDate(hora(14, 30))).toBe('14:30')
  })

  it('formatea último minuto del día', () => {
    expect(formatHoraFromDate(hora(23, 59))).toBe('23:59')
  })

  it('roundtrip con parseTimeToMinutes es consistente', () => {
    const slots = ['09:00', '12:30', '14:45', '19:00']
    for (const slot of slots) {
      const [h, m] = slot.split(':').map(Number)
      expect(formatHoraFromDate(hora(h, m))).toBe(slot)
    }
  })
})

// ─── formatFechaFromDate ──────────────────────────────────────────────────────

describe('formatFechaFromDate', () => {
  it('extrae la fecha UTC en formato YYYY-MM-DD', () => {
    // Noon UTC es seguro: ningún offset horario cambia la fecha
    expect(formatFechaFromDate(new Date('2024-01-15T12:00:00.000Z'))).toBe('2024-01-15')
  })

  it('maneja fechas a principio de mes', () => {
    expect(formatFechaFromDate(new Date('2024-03-01T12:00:00.000Z'))).toBe('2024-03-01')
  })

  it('maneja último día del año', () => {
    expect(formatFechaFromDate(new Date('2024-12-31T12:00:00.000Z'))).toBe('2024-12-31')
  })

  it('siempre devuelve exactamente 10 caracteres (YYYY-MM-DD)', () => {
    const result = formatFechaFromDate(new Date('2024-06-05T12:00:00.000Z'))
    expect(result).toHaveLength(10)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ─── getUTCDateKey ────────────────────────────────────────────────────────────

describe('getUTCDateKey', () => {
  it('extrae la clave de fecha usando métodos UTC (no locales)', () => {
    // Prisma devuelve columnas DATE como medianoche UTC
    const midnightUTC = new Date('2024-01-15T00:00:00.000Z')
    expect(getUTCDateKey(midnightUTC)).toBe('2024-01-15')
  })

  it('añade cero inicial a mes y día de un dígito', () => {
    expect(getUTCDateKey(new Date('2024-03-05T00:00:00.000Z'))).toBe('2024-03-05')
  })

  it('maneja diciembre (mes 12)', () => {
    expect(getUTCDateKey(new Date('2024-12-31T00:00:00.000Z'))).toBe('2024-12-31')
  })

  it('es estable ante offsets de zona horaria: usa UTC, no local', () => {
    // Si el servidor está en UTC-5, medianoche UTC sería el día ANTERIOR en hora local.
    // getUTCDateKey debe devolver siempre la fecha UTC almacenada en la DB.
    const midnightUTC = new Date('2024-07-04T00:00:00.000Z')
    expect(getUTCDateKey(midnightUTC)).toBe('2024-07-04')
  })

  it('noon UTC también devuelve la misma fecha', () => {
    // createNoonUTCDate produce noon UTC; getUTCDateKey debe leerla igual
    const noon = new Date('2024-09-20T12:00:00.000Z')
    expect(getUTCDateKey(noon)).toBe('2024-09-20')
  })
})

// ─── createNoonUTCDate ────────────────────────────────────────────────────────

describe('createNoonUTCDate', () => {
  it('devuelve una fecha con hora UTC = 12', () => {
    const result = createNoonUTCDate('2024-01-15')
    expect(result.getUTCHours()).toBe(12)
    expect(result.getUTCMinutes()).toBe(0)
    expect(result.getUTCSeconds()).toBe(0)
  })

  it('la fecha UTC del resultado coincide con la entrada', () => {
    const result = createNoonUTCDate('2024-01-15')
    expect(getUTCDateKey(result)).toBe('2024-01-15')
  })

  it('ignora la parte de tiempo si se pasa un datetime ISO', () => {
    // Solo usa la parte YYYY-MM-DD del string
    const result = createNoonUTCDate('2024-03-20T08:00:00')
    expect(getUTCDateKey(result)).toBe('2024-03-20')
    expect(result.getUTCHours()).toBe(12)
  })

  it('funciona con fechas de fin de año', () => {
    const result = createNoonUTCDate('2024-12-31')
    expect(getUTCDateKey(result)).toBe('2024-12-31')
  })

  it('roundtrip: getUTCDateKey(createNoonUTCDate(s)) === s para cualquier fecha YYYY-MM-DD', () => {
    const fechas = ['2024-01-01', '2024-06-15', '2025-03-08', '2024-12-25']
    for (const f of fechas) {
      expect(getUTCDateKey(createNoonUTCDate(f))).toBe(f)
    }
  })
})

// ─── isTimeOverlapping ────────────────────────────────────────────────────────
// Lógica: reqStart < existingEnd && reqEnd > existingStart
// Cita de referencia: 09:00–10:00 (540–600 min)

describe('isTimeOverlapping', () => {
  // ── Casos sin solapamiento ──────────────────────────────────────────────────

  it('no solapa: cita nueva completamente antes', () => {
    // 07:00–08:00 vs 09:00–10:00
    expect(isTimeOverlapping(420, 480, 540, 600)).toBe(false)
  })

  it('no solapa: cita nueva termina exactamente cuando la existente empieza', () => {
    // 08:00–09:00 adjacent al inicio de 09:00–10:00
    expect(isTimeOverlapping(480, 540, 540, 600)).toBe(false)
  })

  it('no solapa: cita nueva empieza exactamente cuando la existente termina', () => {
    // 10:00–11:00 adjacent al fin de 09:00–10:00
    expect(isTimeOverlapping(600, 660, 540, 600)).toBe(false)
  })

  it('no solapa: cita nueva completamente después', () => {
    // 11:00–12:00 vs 09:00–10:00
    expect(isTimeOverlapping(660, 720, 540, 600)).toBe(false)
  })

  // ── Casos con solapamiento ──────────────────────────────────────────────────

  it('solapa: mismo horario exacto', () => {
    // 09:00–10:00 vs 09:00–10:00
    expect(isTimeOverlapping(540, 600, 540, 600)).toBe(true)
  })

  it('solapa: nueva empieza antes y termina durante la existente', () => {
    // 08:30–09:30 vs 09:00–10:00 (solapamiento en 09:00–09:30)
    expect(isTimeOverlapping(510, 570, 540, 600)).toBe(true)
  })

  it('solapa: nueva empieza durante y termina después de la existente', () => {
    // 09:30–11:00 vs 09:00–10:00 (solapamiento en 09:30–10:00)
    expect(isTimeOverlapping(570, 660, 540, 600)).toBe(true)
  })

  it('solapa: nueva completamente contenida dentro de la existente', () => {
    // 09:15–09:45 vs 09:00–10:00
    expect(isTimeOverlapping(555, 585, 540, 600)).toBe(true)
  })

  it('solapa: nueva contiene completamente a la existente', () => {
    // 08:00–11:00 vs 09:00–10:00
    expect(isTimeOverlapping(480, 660, 540, 600)).toBe(true)
  })

  it('solapa: misma hora de inicio, termina antes', () => {
    // 09:00–09:30 vs 09:00–10:00
    expect(isTimeOverlapping(540, 570, 540, 600)).toBe(true)
  })

  it('solapa: misma hora de inicio, termina después', () => {
    // 09:00–11:00 vs 09:00–10:00
    expect(isTimeOverlapping(540, 660, 540, 600)).toBe(true)
  })

  it('solapa: misma hora de fin, empieza antes', () => {
    // 08:00–10:00 vs 09:00–10:00
    expect(isTimeOverlapping(480, 600, 540, 600)).toBe(true)
  })

  it('solapa: un solo minuto de intersección al inicio', () => {
    // 09:00–09:01 dentro de 09:00–10:00
    expect(isTimeOverlapping(540, 541, 540, 600)).toBe(true)
  })

  it('solapa: un solo minuto de intersección al final', () => {
    // 09:59–10:30 con la cita existente 09:00–10:00
    expect(isTimeOverlapping(599, 630, 540, 600)).toBe(true)
  })

  // ── Casos límite con múltiples servicios ───────────────────────────────────

  it('no solapa: servicio de 90 min termina justo cuando el siguiente empieza', () => {
    // Cita A: 09:00 + 90 min = 10:30 (540–630)
    // Cita B: 10:30 + 60 min = 11:30 (630–690)
    expect(isTimeOverlapping(630, 690, 540, 630)).toBe(false)
  })

  it('solapa: servicio de 90 min se superpone 15 min con el siguiente', () => {
    // Cita A: 09:00–10:30 (540–630), Cita B empieza a las 10:15
    expect(isTimeOverlapping(615, 675, 540, 630)).toBe(true)
  })

  it('es simétrica: A solapa B implica B solapa A', () => {
    // Verificar que el solapamiento es bidireccional
    const aStart = 540; const aEnd = 600 // 09:00–10:00
    const bStart = 570; const bEnd = 660 // 09:30–11:00

    expect(isTimeOverlapping(aStart, aEnd, bStart, bEnd)).toBe(
      isTimeOverlapping(bStart, bEnd, aStart, aEnd),
    )
  })
})

// ─── parsePrecioAjustado ──────────────────────────────────────────────────────

describe('parsePrecioAjustado', () => {
  // ── Casos que deben retornar null ─────────────────────────────────────────

  it('retorna null para string vacío', () => {
    expect(parsePrecioAjustado('')).toBeNull()
  })

  it('retorna null para null explícito', () => {
    expect(parsePrecioAjustado(null)).toBeNull()
  })

  it('retorna null para undefined', () => {
    expect(parsePrecioAjustado(undefined)).toBeNull()
  })

  it('retorna null para texto no numérico', () => {
    expect(parsePrecioAjustado('abc')).toBeNull()
  })

  it('retorna null para "NaN" literal', () => {
    expect(parsePrecioAjustado('NaN')).toBeNull()
  })

  // ── Casos que deben retornar un número ───────────────────────────────────

  it('convierte "0" a número 0 (descuento nulo es válido)', () => {
    expect(parsePrecioAjustado('0')).toBe(0)
  })

  it('convierte número 0 a 0', () => {
    expect(parsePrecioAjustado(0)).toBe(0)
  })

  it('convierte string de precio entero', () => {
    expect(parsePrecioAjustado('100')).toBe(100)
  })

  it('convierte número entero directamente', () => {
    expect(parsePrecioAjustado(100)).toBe(100)
  })

  it('convierte precio decimal (descuento parcial)', () => {
    expect(parsePrecioAjustado('50.5')).toBe(50.5)
    expect(parsePrecioAjustado(50.5)).toBe(50.5)
  })

  it('convierte precios grandes', () => {
    expect(parsePrecioAjustado('250000')).toBe(250000)
  })

  it('convierte precio negativo (ajuste por error de cobro)', () => {
    expect(parsePrecioAjustado('-50')).toBe(-50)
  })

  // ── Comportamiento documentado de casos edge ─────────────────────────────

  it('string de espacio en blanco: Number(" ") = 0, retorna 0', () => {
    // Number(" ") = 0 en JS, isNaN(0) = false → el código retorna 0.
    // Se testea para documentar este comportamiento, no como feature.
    expect(parsePrecioAjustado(' ')).toBe(0)
  })

  // ── Invariantes de tipo de retorno ────────────────────────────────────────

  it('el resultado es siempre null o un número finito', () => {
    const inputs: (string | number | null | undefined)[] = [
      '', null, undefined, 'abc', '0', '100', 50, -10, '50.5',
    ]
    for (const input of inputs) {
      const result = parsePrecioAjustado(input)
      if (result !== null) {
        expect(typeof result).toBe('number')
        expect(Number.isFinite(result)).toBe(true)
      }
    }
  })
})
