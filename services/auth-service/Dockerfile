FROM node:22-alpine

WORKDIR /workspace

COPY libs ./libs

COPY services/auth-service ./services/auth-service

WORKDIR /workspace/services/auth-service

RUN npm install

RUN npx prisma generate

EXPOSE 3002

CMD ["npm", "run", "start:dev"]