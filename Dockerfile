FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=envless --docker
RUN rm -rf apps/cli apps/docs apps/www

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY apps/platform/.gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install
 
# Build the project
COPY --from=builder /app/out/full/ .

ENV SKIP_ENV_VALIDATION true
ENV EMAIL_FROM envless@example.com
RUN yarn turbo run build --filter=platform...

CMD ["yarn","dev"]

#ENTRYPOINT ["tail", "-f", "/dev/null"]
