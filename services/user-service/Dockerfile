FROM node:22-alpine

WORKDIR /workspace

COPY libs ./libs

COPY services/user-service ./services/user-service

WORKDIR /workspace/services/user-service

RUN npm install

RUN npx prisma generate

EXPOSE 3003

CMD ["npm", "run", "start:dev"]