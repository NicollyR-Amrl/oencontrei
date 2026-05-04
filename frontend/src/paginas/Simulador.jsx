import React from 'react';
import EmuladorAndroid from '../shared/componentes/EmuladorAndroid';

export default function Simulador() {
  // Pega a URL base do site (ex: localhost:5173)
  const baseUrl = window.location.origin;

  return (
    <div className="w-full h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Header do Simulador */}
      <div className="absolute top-0 left-0 w-full h-14 border-b border-white/5 flex items-center justify-between px-6 z-[100] bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-600/20">
            OE!
          </div>
          <h1 className="text-white font-bold tracking-tight">
            Antigravity <span className="text-primary-400 font-medium">Mobile Lab</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-texto-secundario font-mono">
              PORT: 5173
           </div>
           <button 
             onClick={() => window.location.href = '/'}
             className="text-xs text-texto-secundario hover:text-white transition-colors"
           >
             Sair do Simulador
           </button>
        </div>
      </div>

      <EmuladorAndroid url={baseUrl} />
    </div>
  );
}
