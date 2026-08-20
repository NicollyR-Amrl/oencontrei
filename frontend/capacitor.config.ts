import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oencontrei.app',
  appName: 'O Encontrei!',
  webDir: 'dist',
  server: {
    // Em produção, o app carrega os arquivos locais do dist/
    // As chamadas à API vão direto pra URL configurada no .env.production
    androidScheme: 'https',
  },
  android: {
    // Permite conteúdo misto (HTTP/HTTPS) durante desenvolvimento
    allowMixedContent: true,
  },
};

export default config;
