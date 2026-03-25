import BookingForm from '@/components/BookingForm';

export default function ReservarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 pt-16 pb-20 text-foreground">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-outfit text-brand-dark mb-4">Reserva tu Cita</h1>
          <p className="text-zinc-500">
            Sigue estos sencillos pasos para asegurar tu espacio con nuestras especialistas.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-dark/5 p-6 md:p-10 border border-brand-light/20">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
