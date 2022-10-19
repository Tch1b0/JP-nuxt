FROM node:16.18.0-alpine3.15

WORKDIR /app

COPY . .

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

RUN npm ci
RUN npm run build

EXPOSE ${NUXT_PORT}

CMD ["npm", "run", "start"]