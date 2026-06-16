FROM node:22-alpine

WORKDIR /app

# Instala Angular CLI globalmente pra facilitar
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

# host 0.0.0.0 + poll permitem hot reload via bind mount
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "1000"]
