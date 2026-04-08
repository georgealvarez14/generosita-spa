import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const formatTime12h = (timeStr: string | Date) => {
  try {
    const timeString = typeof timeStr === 'string' ? timeStr : timeStr.toISOString().split('T')[1]?.substring(0, 5) || '';
    if (!timeString) return '';
    const [h, m] = timeString.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  } catch(e) {
    return String(timeStr);
  }
};

export default async function MisCitasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const cliente = await prisma.cliente.findUnique({
    where: { email: user.email }
  });

  if (!cliente) {
    redirect('/login');
  }

  // Fetch only this client's appointments
  // Warning: We must bypass TS checks for prisma.cita due to multiSchema typing issues in this older Prisma client
  const citas = await (prisma as any).cita.findMany({
    where: { cliente_id: cliente.id },
    include: {
      servicios: true,
      estado_cita: true
    },
    orderBy: [
      { fecha: 'desc' },
      { hora: 'desc' }
    ]
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 lg:py-12 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/portal" 
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-100 hover:bg-zinc-50 hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-outfit text-zinc-800 tracking-tight">Mis Citas</h1>
          <p className="text-zinc-500 mt-1">Tu historial de reservas y servicios en Generosita SPA</p>
        </div>
      </div>

      {citas.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-brand/10">
          <div className="w-20 h-20 bg-brand-light/20 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-800 mb-2">Aún no tienes citas</h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-8">
            Parece que todavía no has agendado ningún servicio con nosotras. ¡Anímate a consentirte!
          </p>
          <Link 
            href="/reservar" 
            className="inline-flex items-center gap-2 bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-all hover:scale-105 shadow-xl shadow-brand/20"
          >
            <Sparkles className="w-4 h-4" /> Agendar mi primera cita
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {citas.map((cita: any) => {
            const isPending = cita.estado_id === 1;
            const isConfirmed = cita.estado_id === 2;
            const isCancelled = cita.estado_id === 3;
            // DateTime conversion
            const horaFormat = formatTime12h(cita.hora);
            const fechaFormat = format(new Date(cita.fecha), "eeee, d 'de' MMMM yyyy", { locale: es });

            return (
              <div key={cita.id} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-brand/10 relative overflow-hidden group hover:border-brand/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  {/* Service Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       {isPending && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Pendiente</span>}
                       {isConfirmed && <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Confirmada</span>}
                       {isCancelled && <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Cancelada</span>}
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-800 font-outfit mb-1">{cita.servicios?.map((s:any)=>s.nombre).join(', ')}</h3>
                    <p className="text-brand font-bold flex items-center gap-1 text-lg">
                      ${cita.servicios?.reduce((acc:any,s:any)=>acc+s.precio,0).toLocaleString()} <span className="text-sm text-zinc-400 font-medium line-through decoration-transparent ml-2">• {cita.servicios?.reduce((acc:any,s:any)=>acc+s.duracion,0)} min totales</span>
                    </p>
                  </div>

                  {/* Time Info */}
                  <div className="bg-zinc-50 rounded-2xl p-4 min-w-[240px] border border-zinc-100">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-zinc-600">
                        <Calendar className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                        <span className="text-sm font-medium capitalize">{fechaFormat}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Clock className="w-4 h-4 text-brand shrink-0" />
                        <span className="text-sm font-medium">{horaFormat}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <MapPin className="w-4 h-4 text-brand shrink-0" />
                        <span className="text-sm font-medium">Generosita SPA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
