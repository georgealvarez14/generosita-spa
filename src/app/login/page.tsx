'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { syncUserProfile } from './actions';
import { AlertCircle } from 'lucide-react';

function getSpanishErrorMessage(errorMsg: string) {
  if (errorMsg.includes('Invalid login credentials')) return 'El correo o la contraseña son incorrectos. Por favor, verifica tus datos.';
  if (errorMsg.includes('User already registered')) return 'Este correo electrónico ya está registrado. Si es tuyo, inicia sesión.';
  if (errorMsg.includes('Email not confirmed')) return 'Debes confirmar tu correo electrónico antes de ingresar.';
  if (errorMsg.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  return 'Ocurrió un error: ' + errorMsg;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        // --- INICIAR SESIÓN ---
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(getSpanishErrorMessage(signInError.message));
          setLoading(false);
          return;
        }

        if (!authData.user) {
          setError('No se pudo obtener información del usuario');
          setLoading(false);
          return;
        }

        // Sincronizar y obtener el perfil a través de la Server Action (Bypass RLS)
        const { success, profile, error: syncError } = await syncUserProfile(
          { id: authData.user.id, email: email, user_metadata: authData.user.user_metadata },
          { password: password }
        );
        
        if (!success) {
          setError('No se pudo verificar tu perfil: ' + syncError);
          setLoading(false);
          return;
        }

        const rol = profile?.rol || 'cliente';
        if (rol === 'admin') {
          router.push('/admin');
        } else {
          router.push('/portal');
        }
      } else {
        // --- REGISTRARSE ---
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: nombre,
              phone: telefono,
            }
          }
        });

        if (signUpError) {
          setError(getSpanishErrorMessage(signUpError.message));
          setLoading(false);
          return;
        }

        if (!authData.user) {
          setError('Ocurrió un error creando la cuenta. Intentalo de nuevo.');
          setLoading(false);
          return;
        }

        // Insertar explícitamente en la base de datos de manera segura usando la Server Action
        const { success, error: syncError } = await syncUserProfile(
          { id: authData.user.id, email: email, user_metadata: authData.user.user_metadata },
          { nombre: nombre, telefono: telefono, password: password }
        );

        if (!success) {
          setError('Problema al inicializar el perfil: ' + syncError);
          setLoading(false);
          return;
        }

        if (authData.session === null) {
          // Supabase requiere confirmación de email por defecto
          setSuccessMessage('¡Cuenta creada exitosamente! Revisa tu bandeja de correo para confirmarla antes de iniciar sesión.');
          setIsLogin(true); // Cambiamos la vista
        } else {
          // Si no requiere confirmación, login automático
          router.push('/portal');
        }
      }
    } catch (err: unknown) {
      setError('Error inesperado: ' + (err instanceof Error ? err.message : 'intenta de nuevo'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 w-full min-h-max">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl shadow-purple-900/10 overflow-hidden flex flex-col lg:flex-row border border-purple-100/60">
        
        {/* Lado Izquierdo - Visual */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-700 via-[#9333ea] to-pink-500 text-white flex-col justify-between p-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/30 border-dashed animate-spin-slow" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md shadow-sm rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-white/20 transition-colors">
              <span>←</span> Volver al inicio
            </Link>
          </div>

          <div className="relative z-10 mt-12 mb-10">
            <h1 className="text-4xl font-bold font-outfit mb-5 leading-tight tracking-tight">
              {isLogin ? 'Bienvenida de nuevo a' : 'Comienza a disfrutar con'} <br />Generosita SPA 💜
            </h1>
            <p className="text-purple-100 text-[1.1rem] leading-relaxed">
              {isLogin 
                ? 'Inicia sesión para gestionar tus citas, ver tu historial de servicios y descubrir ofertas exclusivas pensadas para ti.'
                : 'Crea tu cuenta hoy mismo y empieza a gestionar tus citas de spa de manera digital, rápida y hermosa.'}
            </p>
          </div>
          
          <div className="relative z-10">
            <p className="text-sm font-medium text-purple-200/90 tracking-wide">
              © {new Date().getFullYear()} Generosita SPA by Ena Giraldo
            </p>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
          <div className="w-full max-w-sm space-y-8">
            
            <div className="text-center lg:text-left">
              <div className="lg:hidden mb-6 text-left">
                 <Link href="/" className="text-sm text-brand font-semibold hover:text-brand-dark transition-colors inline-block bg-brand/5 px-4 py-2 rounded-full">
                   ← Volver al inicio
                 </Link>
              </div>
              
              <h2 className="text-3xl font-bold font-outfit text-purple-950 mb-2 tracking-tight">
                {isLogin ? 'Ingresar a tu cuenta' : 'Crear tu cuenta'}
              </h2>
              <p className="text-purple-900/60 font-medium text-sm">
                {isLogin ? 'Por favor, ingresa tus credenciales abajo.' : 'Llena los siguientes datos para registrarte.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50/80 border border-red-100 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-red-700 text-sm font-medium leading-relaxed">{error}</div>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-brand/10 border-l-4 border-brand p-4 rounded-r-xl flex items-center shadow-sm">
                <div className="text-brand-dark text-sm font-medium">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-purple-950/80">Nombre Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required={!isLogin}
                        className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/80 focus:border-brand transition-all shadow-sm font-medium text-purple-950 placeholder-purple-300"
                        placeholder="Ej. Ana Pérez"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-purple-950/80">Teléfono</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required={!isLogin}
                        className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/80 focus:border-brand transition-all shadow-sm font-medium text-purple-950 placeholder-purple-300"
                        placeholder="Ej. 300 000 0000"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-purple-950/80">Correo Electrónico</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/80 focus:border-brand transition-all shadow-sm font-medium text-purple-950 placeholder-purple-300"
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-purple-950/80">Contraseña</label>
                  {isLogin && (
                    <a href="#" className="text-xs font-bold text-brand hover:text-brand-dark transition-colors">¿Olvidaste tu contraseña?</a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/80 focus:border-brand transition-all shadow-sm font-medium text-purple-950 placeholder-purple-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`relative w-full overflow-hidden group mt-6 py-4 rounded-xl text-white font-bold transition-all shadow-lg ${
                  loading ? 'bg-purple-300 cursor-not-allowed shadow-none' : 'bg-brand hover:shadow-brand/40 hover:-translate-y-[2px] hover:bg-brand-dark active:translate-y-0'
                }`}
              >
                {!loading && (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-12 group-hover:animate-shimmer" />
                )}
                <span className="relative z-10 tracking-wide">
                  {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-purple-50 text-center flex flex-col items-center">
              <p className="text-sm text-purple-900/60 font-medium mb-2">
                {isLogin ? '¿No tienes una cuenta aún?' : '¿Ya tienes una cuenta?'}
              </p>
              <button 
                onClick={toggleMode}
                className="font-bold text-brand hover:text-brand-dark transition-colors inline-block"
              >
                {isLogin ? 'Crea una cuenta ahora' : 'Inicia sesión aquí'}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
