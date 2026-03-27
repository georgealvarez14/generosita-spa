import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Rutas públicas que no necesitan auth
  const publicRoutes = ['/', '/servicios', '/galeria', '/login', '/admin/login']
  if (publicRoutes.includes(pathname)) {
    return supabaseResponse
  }

  // Si no hay usuario y está en ruta protegida, redirigir a login
  if (!user && (pathname.startsWith('/admin') || pathname.startsWith('/portal') || pathname.startsWith('/reservar'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si ya está autenticado y trata de ir a login, por defecto lo mandamos a portal
  // Los layouts individuales de /admin o /portal se encargarán de verificar el rol real con Prisma
  if (user && (pathname === '/login' || pathname === '/admin/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
