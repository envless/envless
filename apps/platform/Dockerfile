FROM node:alpine AS builder
ENV SKIP_ENV_VALIDATION False

RUN apk add --no-cache libc6-compat
RUN apk update

# Set the working directory
WORKDIR /app
RUN yarn global add turbo

# Copy source files
COPY . .
RUN turbo prune --scope=platform --docker

# FROM node:18-alpine AS installer
# RUN apk add --no-cache libc6-compat
# RUN apk update
# WORKDIR /app

# # Copy root package.json and lockfile
# #COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock
# RUN yarn install

# # Build the project
# COPY --from=builder /app/out/full/ .
# #COPY turbo.json turbo.json

# RUN yarn turbo run build --filter=platform...
 
# FROM node:alpine AS runner
# WORKDIR /app
 
# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# COPY --from=installer /app/apps/platform/next.config.js .
# COPY --from=installer /app/apps/platform/package.json .
 
# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# #COPY --from=installer --chown=nextjs:nodejs /app/apps/platform/.next/standalone ./
# #COPY --from=installer --chown=nextjs:nodejs /app/apps/platform/.next/static ./apps/platform/.next/static
# #COPY --from=installer --chown=nextjs:nodejs /app/apps/platform/public ./apps/platform/public
 
# CMD node apps/api/server.js

