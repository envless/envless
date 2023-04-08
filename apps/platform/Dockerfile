FROM node:18-alpine AS builder

ENV NODE_ENV development

RUN apk add --no-cache libc6-compat
RUN apk add --update --no-cache openssl1.1-compat
RUN yarn global add turbo@1.6.3
RUN apk update

# Set working directory
WORKDIR /app
COPY . .
RUN turbo prune --scope=docs --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine AS installer
# RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
#COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=docs...

FROM node:18-alpine AS runner
WORKDIR /app

# # Don't run production as root
RUN addgroup --system --gid 1001 platform
RUN adduser --system --uid 1001 platform
USER platform
COPY --from=installer /app .

WORKDIR /app/apps/platform
RUN npx prisma generate

EXPOSE 3000
CMD [ "yarn", "dev" ]