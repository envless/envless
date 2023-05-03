FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN rm -rf apps/cli apps/docs apps/www
RUN turbo prune --scope=console --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN npm install -g dotenv-cli

WORKDIR /app
RUN mkdir -p packages/ui
COPY --from=builder /app/packages/ui packages/ui

# First install the dependencies (as they change less often)
COPY apps/console/.gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install
 
# Build the project
COPY --from=builder /app/out/full/ .

ENV SKIP_ENV_VALIDATION true
ENV EMAIL_FROM envless@example.com
RUN npx turbo run db:generate

# RUN yarn turbo run build --filter=console...

EXPOSE 3000 3883

CMD ["yarn","dev", "--filter=console"]
