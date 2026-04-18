import { Suspense } from 'react';
import BookingForm from '@/components/BookingForm';
import { Sparkles } from 'lucide-react';

export default function ReservarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-white/60 px-4 py-2 text-sm font-medium text-purple-700 backdrop-blur-sm mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            Reserva Fácil
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-purple-900 mb-4">
            Reserva tu Cita
          </h1>
          <p className="text-purple-700/70 text-lg max-w-xl mx-auto">
            Sigue estos sencillos pasos para asegurar tu espacio con nuestras especialistas.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 p-6 md:p-10 border border-purple-100">
          <Suspense fallback={
            <div className="text-center py-12 text-zinc-400 animate-pulse">
              Cargando formulario...
            </div>
          }>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
