import React from 'react';

/**
 * EmuladorAndroid - Um frame de smartphone premium feito em CSS puro
 * para simular a experiência mobile dentro do navegador.
 */
export default function EmuladorAndroid({ children, url }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 font-sans">
      <div className="relative">
        {/* Sombra do dispositivo */}
        <div className="absolute -inset-4 bg-primary-500/20 blur-3xl rounded-[3rem] opacity-50"></div>
        
        {/* Corpo do Smartphone (Pixel 9 style) */}
        <div className="relative w-[380px] h-[780px] bg-[#0f1115] rounded-[3.5rem] p-3 shadow-2xl border-[8px] border-[#1f2125]">
          
          {/* Botões laterais */}
          <div className="absolute -right-[10px] top-32 w-[3px] h-16 bg-[#2d3035] rounded-l-md"></div>
          <div className="absolute -right-[10px] top-52 w-[3px] h-24 bg-[#2d3035] rounded-l-md"></div>

          {/* Área da Tela */}
          <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden flex flex-col">
            
            {/* Barra de Status */}
            <div className="h-7 bg-transparent absolute top-0 w-full flex justify-between items-center px-8 z-50 pointer-events-none">
              <span className="text-[10px] font-bold text-slate-800">14:05</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 rounded-full border border-slate-800/30 flex items-center justify-center p-[1px]">
                   <div className="w-full h-full bg-slate-800 rounded-full"></div>
                </div>
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-sm"></div>
              </div>
            </div>

            {/* Notch (Câmera Frontal) */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-[60] border border-white/5 shadow-inner"></div>

            {/* Iframe ou Conteúdo */}
            <div className="flex-1 w-full h-full overflow-hidden">
              {url ? (
                <iframe 
                  src={url} 
                  className="w-full h-full border-none"
                  title="App Preview"
                />
              ) : (
                <div className="w-full h-full overflow-y-auto bg-fundo-escuro">
                  {children}
                </div>
              )}
            </div>

            {/* Barra de Navegação Android (Gesture bar) */}
            <div className="h-6 bg-transparent absolute bottom-0 w-full flex justify-center items-center z-50 pointer-events-none">
              <div className="w-24 h-1 bg-slate-800/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Labels informativas */}
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 hidden xl:block space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-32 shadow-xl">
            <p className="text-[10px] uppercase tracking-widest text-primary-400 font-bold mb-1">Modelo</p>
            <p className="text-white text-sm font-semibold">Pixel 9 Pro</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-32 shadow-xl">
            <p className="text-[10px] uppercase tracking-widest text-acento-400 font-bold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-acento-500 rounded-full animate-pulse"></div>
              <p className="text-white text-sm font-semibold">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
