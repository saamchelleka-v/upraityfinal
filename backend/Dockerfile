# Lightweight Node.js Dockerfile for Google Cloud Run
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

EXPOSE 8080

CMD ["node", "src/server.js"]
