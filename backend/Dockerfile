# Backend
FROM node:20-alpine
WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Criar pasta de uploads
RUN mkdir -p uploads

EXPOSE 3000

# Comando para rodar migrações e iniciar o servidor
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node src/servidor.js"]
