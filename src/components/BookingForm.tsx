'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, User, Phone, MapPin, Search, ArrowRight } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

type Servicio = { id: string; nombre: string; precio: number; duracion: number };
type Step = 1 | 2 | 3 | 4;

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

// 5 days from today
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = addDays(today, i);
    // basic filter for Sundays (0) if the salon is closed
    if (d.getDay() !== 0) {
      dates.push(d);
    }
  }
  return dates;
};

export default function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Servicio[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  // Form State
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', notas: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorLine, setErrorLine] = useState('');

  const dates = getAvailableDates();

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, []);

  const handleNext = () => {
    setErrorLine('');
    if (step === 1 && !selectedService) { setErrorLine('Selecciona un servicio primero'); return; }
    if (step === 2 && (!selectedDate || !selectedTime)) { setErrorLine('Selecciona fecha y hora'); return; }
    
    setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    setErrorLine('');
    setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.telefono) {
      setErrorLine('Nombre y teléfono son obligatorios');
      return;
    }
    
    setIsSubmitting(true);
    setErrorLine('');
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          fecha: selectedDate?.toISOString(),
          hora: selectedTime,
          servicioId: selectedService?.id,
          notas: formData.notas
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al reservar');
      }
      
      // Move to success step
      setStep(4);
      
    } catch (err: any) {
      setErrorLine(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
     const phone = '573172137402'; // Replace with real business phone
     const text = `¡Hola Generosita Spa! Acabo de reservar a través de la web.%0A%0A*Detalles de mi cita:*%0A👤 ${formData.nombre}%0A💅 Servicio: ${selectedService?.nombre}%0A📅 Fecha: ${selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: es }) : ''}%0A⏰ Hora: ${selectedTime}%0A%0APor favor, confirmen mi asistencia. 💜`;
     window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      {step < 4 && (
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className={`text-xs font-bold ${step >= 1 ? 'text-brand' : 'text-zinc-400'}`}>Servicio</span>
            <span className={`text-xs font-bold ${step >= 2 ? 'text-brand' : 'text-zinc-400'}`}>Fecha y Hora</span>
            <span className={`text-xs font-bold ${step >= 3 ? 'text-brand' : 'text-zinc-400'}`}>Tus Datos</span>
          </div>
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden flex">
            <div className={`h-full bg-brand transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>
        </div>
      )}

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold font-outfit text-brand-dark mb-6">Elige el servicio</h2>
          {loadingServices ? (
            <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
               {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-zinc-100 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedService(s)}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
                    selectedService?.id === s.id 
                      ? 'border-brand bg-brand-light/10 shadow-md shadow-brand/10' 
                      : 'border-zinc-100 bg-white hover:border-brand-light'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-zinc-800">{s.nombre}</h3>
                    <span className="text-brand font-bold">${s.precio}</span>
                  </div>
                  <div className="flex items-center text-xs text-zinc-500 mt-2">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {s.duracion} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="animate-fade-in relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-outfit text-brand-dark">Selecciona horario</h2>
            {selectedService && (
               <div className="text-sm bg-brand-light/20 text-brand px-3 py-1 rounded-full font-medium">
                 {selectedService.nombre}
               </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-zinc-700 mb-3 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-brand" /> Días disponibles
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      selectedDate && isSameDay(d, selectedDate)
                        ? 'bg-brand text-white border-brand shadow-md transform scale-[1.02]'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-brand-light'
                    }`}
                  >
                    <div className="text-xs uppercase font-medium opacity-80">{format(d, 'EEE', { locale: es })}</div>
                    <div className="text-lg font-bold">{format(d, 'd', { locale: es })}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-zinc-700 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-brand" /> Horas disponibles
              </h3>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-3 px-4 rounded-xl border text-center transition-all ${
                        selectedTime === t
                          ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                          : 'bg-white border-zinc-200 text-zinc-700 hover:border-brand-light'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                  <p className="text-zinc-400 text-sm text-center px-4">Selecciona un día primero para ver los horarios disponibles.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: User Details */}
      {step === 3 && (
         <div className="animate-fade-in relative pb-10">
            <h2 className="text-2xl font-bold font-outfit text-brand-dark mb-6">Tus datos de reserva</h2>
            
            <div className="bg-brand-light/10 p-5 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border border-brand/20 mb-8">
               <div>
                 <p className="text-brand-dark font-bold text-lg">{selectedService?.nombre}</p>
                 <p className="text-zinc-600 text-sm flex items-center gap-1 mt-1">
                   <CalendarIcon className="w-3.5 h-3.5 shadow" /> 
                   {selectedDate && format(selectedDate, "eeee, dd 'de' MMMM", { locale: es })} a las {selectedTime}
                 </p>
               </div>
               <div className="text-right">
                 <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">A pagar en el local</p>
                 <p className="text-2xl font-bold text-brand">${selectedService?.precio}</p>
               </div>
            </div>

            <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre Completo *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl focus:ring-brand focus:border-brand bg-zinc-50 focus:bg-white transition-colors outline-none text-brand-dark font-medium"
                    placeholder="Ej. Camila Pérez"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">WhatsApp / Teléfono *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    required
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl focus:ring-brand focus:border-brand bg-zinc-50 focus:bg-white transition-colors outline-none text-brand-dark font-medium"
                    placeholder="Para confirmar tu cita"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Notas para la especialista (opcional)</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  rows={3}
                  className="block w-full p-3 border border-zinc-200 rounded-xl focus:ring-brand focus:border-brand bg-zinc-50 focus:bg-white transition-colors outline-none resize-none text-brand-dark font-medium"
                  placeholder="Ej. Cuidado al retirar mi set anterior, diseño a mano alzada."
                />
              </div>
            </form>
         </div>
      )}

      {/* Step 4: Success Message */}
      {step === 4 && (
        <div className="py-12 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold font-outfit text-brand-dark mb-2">¡Tu cita quedó lista! 💜</h2>
          <p className="text-zinc-600 max-w-md mx-auto mb-8 text-lg">
            Hemos registrado tu espacio. Solo falta un paso para confirmar la reserva definitivamente.
          </p>
          
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 mb-8 max-w-sm mx-auto text-left">
             <div className="flex gap-4 mb-4 items-start">
               <div className="bg-brand/10 p-2 rounded-lg text-brand"><CalendarIcon className="w-5 h-5"/></div>
               <div>
                 <p className="text-sm text-zinc-500 font-medium">Cuándo</p>
                 <p className="font-bold text-zinc-800">{selectedDate && format(selectedDate, "PPPP", { locale: es })}</p>
                 <p className="text-brand font-bold">{selectedTime}</p>
               </div>
             </div>
             <div className="flex gap-4 items-start border-t border-zinc-200 pt-4">
               <div className="bg-brand/10 p-2 rounded-lg text-brand"><MapPin className="w-5 h-5"/></div>
               <div>
                 <p className="text-sm text-zinc-500 font-medium">Dónde</p>
                 <p className="font-bold text-zinc-800">Generosita Spa</p>
               </div>
             </div>
          </div>

          <button
            onClick={handleWhatsAppRedirect}
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#25D366] px-10 text-lg font-bold text-white transition-transform hover:scale-105 shadow-xl shadow-[#25D366]/20 w-full sm:w-auto"
          >
            Confirmar por WhatsApp
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}

      {/* Controls */}
      {step < 4 && (
        <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
          <button
            onClick={handleBack}
            className={`font-medium text-zinc-500 hover:text-brand transition-colors px-4 py-2 rounded-lg ${step === 1 ? 'invisible' : ''}`}
          >
            Atrás
          </button>
          
          <div className="flex-1 text-center text-red-500 text-sm font-medium px-4">
            {errorLine}
          </div>

          {step < 3 ? (
             <button
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Siguiente <ChevronRight className="ml-1 w-5 h-5" />
            </button>
          ) : (
            <button
              form="booking-form"
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center rounded-full px-8 py-3 font-bold text-white transition-all ${
                isSubmitting ? 'bg-zinc-400 cursor-not-allowed' : 'bg-brand hover:bg-brand-dark shadow-xl hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? 'Procesando...' : 'Finalizar Reserva'} 
              {!isSubmitting && <CheckCircle2 className="ml-2 w-5 h-5" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
