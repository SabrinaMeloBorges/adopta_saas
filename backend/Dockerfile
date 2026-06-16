FROM node:22-alpine

WORKDIR /app

# Instala dependências primeiro pra aproveitar cache
COPY package*.json ./
RUN npm install

# Copia código (sobrescrito pelo bind mount em dev)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
