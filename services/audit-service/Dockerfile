FROM node:22-alpine

WORKDIR /workspace

COPY libs ./libs

COPY services/audit-service ./services/audit-service

WORKDIR /workspace/services/audit-service

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:dev"]