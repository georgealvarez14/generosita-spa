'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Autenticar con Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('No se pudo obtener información del usuario');
        setLoading(false);
        return;
      }

      // 2. Verificar el rol en la base de datos
      const { data: clienteData, error: clienteError } = await supabase
        .from('cliente')
        .select('rol')
        .eq('email', email)
        .single();

      if (clienteError) {
        setError('Error al verificar permisos: ' + clienteError.message);
        setLoading(false);
        return;
      }

      // 3. Redirigir según el rol
      const rol = clienteData?.rol || 'cliente';
      
      if (rol === 'admin') {
        router.push('/admin');
      } else {
        router.push('/portal'); // Portal del cliente
      }
      router.refresh();
    } catch (err: any) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-brand-dark/10 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-outfit text-brand-dark mb-2">Generosita SPA</h1>
          <p className="text-zinc-500">Acceso Administrativo</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors bg-zinc-50"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors bg-zinc-50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-bold transition-all ${
              loading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-brand hover:bg-brand-dark shadow-lg shadow-brand/30 hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Entrando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
