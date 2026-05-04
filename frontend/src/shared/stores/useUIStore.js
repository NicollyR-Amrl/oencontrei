import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarColapsada: false,
  
  toggleSidebar: () => set((state) => ({ 
    sidebarColapsada: !state.sidebarColapsada 
  })),
  
  setSidebarColapsada: (val) => set({ sidebarColapsada: val }),
}));

export default useUIStore;
