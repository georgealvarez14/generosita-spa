'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageIcon, Upload, Trash2, Loader2, X, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

type GaleriaItem = {
  id: string;
  imagen_url: string;
  descripcion: string | null;
  created_at: string;
};

export default function GaleriaAdmin() {
  const [images, setImages] = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<{ file: File; url: string; desc: string } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/galeria')
      .then(r => r.json())
      .then(d => setImages(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Solo se aceptan imágenes.'); return; }
    setUploadError('');
    setUploadSuccess(false);
    setPreview({ file, url: URL.createObjectURL(file), desc: '' });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const uploadImage = async () => {
    if (!preview) return;
    setUploading(true); setUploadError('');
    const fd = new FormData();
    fd.append('file', preview.file);
    fd.append('descripcion', preview.desc);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setUploadError(data.error || 'Error al subir'); return; }
    setUploadSuccess(true);
    setPreview(null);
    load();
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const deleteImage = async (id: string) => {
    if (!confirm('¿Eliminar esta foto de la galería?')) return;
    setDeletingId(id);
    await fetch('/api/galeria', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } });
    setDeletingId(null);
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-zinc-800">Galería de Fotos</h1>
        <p className="text-zinc-400 text-sm mt-0.5">{images.length} foto{images.length !== 1 ? 's' : ''} publicada{images.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Upload zone */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-zinc-700 flex items-center gap-2 text-sm">
          <Upload className="w-4 h-4 text-brand" /> Subir nueva foto
        </h2>

        {/* Success banner */}
        {uploadSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> ¡Foto subida exitosamente!
          </div>
        )}

        {/* Error banner */}
        {uploadError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {uploadError}
          </div>
        )}

        {preview ? (
          /* Preview before upload */
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-zinc-200 shrink-0">
                <Image src={preview.url} alt="preview" fill className="object-cover" />
                <button onClick={() => setPreview(null)}
                  className="absolute top-1.5 right-1.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 font-medium mb-1 block">Descripción (opcional)</label>
                  <textarea
                    value={preview.desc}
                    onChange={e => setPreview(p => p ? { ...p, desc: e.target.value } : p)}
                    rows={3}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-800 resize-none focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Ej. Diseño en gel con nail art floral 🌸"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPreview(null)} className="px-4 py-2 rounded-lg text-zinc-500 text-sm hover:bg-zinc-100 transition">
                    Cancelar
                  </button>
                  <button onClick={uploadImage} disabled={uploading}
                    className="flex items-center gap-2 bg-brand text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-brand-dark transition shadow-md shadow-brand/20">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Subiendo...' : 'Publicar foto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Drop zone */
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center py-12 px-6 text-center ${
              dragOver ? 'border-brand bg-brand-light/20' : 'border-zinc-200 hover:border-brand hover:bg-zinc-50'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${dragOver ? 'bg-brand-light/50 text-brand-dark' : 'bg-zinc-100 text-zinc-400'}`}>
              <ImageIcon className="w-7 h-7" />
            </div>
            <p className="font-semibold text-zinc-600 text-sm">Arrastra una foto aquí o haz clic para seleccionar</p>
            <p className="text-zinc-400 text-xs mt-1">JPG, PNG, WEBP — máx 10 MB</p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
          </div>
        )}
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <ImageIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">Aún no hay fotos en la galería.</p>
          <p className="text-zinc-400 text-xs mt-1">Sube la primera foto usando el área de arriba.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all">
              <Image src={img.imagen_url} alt={img.descripcion || 'Galería Generosita SPA'} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                {img.descripcion && (
                  <p className="text-white text-xs font-medium line-clamp-2 mb-2 leading-relaxed">{img.descripcion}</p>
                )}
                <button
                  onClick={() => deleteImage(img.id)}
                  disabled={deletingId === img.id}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition"
                >
                  {deletingId === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
