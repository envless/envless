# setting base image
FROM node:18.16-alpine3.18 AS base
WORKDIR /app
ENTRYPOINT ["yarn"]

# turbo cleanup
FROM base AS builder
COPY . .
RUN set ex; \
    \
    apk update; \
    apk add libc6-compat; \
    yarn global add turbo; \
    rm -rf \
       /var/cache/apt/* \
       apps/cli \
       apps/docs \
       apps/www \
    ; \
    turbo prune --scope=platform --docker

# production image setup
FROM base
RUN set ex; \
    \
    apk update; \
    apk add libc6-compat; \
    yarn global add dotenv-cli; \
    mkdir -p packages/ui; \
    rm -rf /var/cache/apt/*

COPY --from=builder --chown=node:node ["/app/packages/ui", "packages/ui"]
COPY --from=builder --chown=node:node ["/app/out/json/", "/app/out/yarn.lock", "./"]

RUN set ex; \
  \
  yarn install --immutable --immutable-cache --check-cache; \
  yarn cache clean --all;

COPY --from=builder --chown=node:node ["/app/out/full/", "."]

ENV NODE_ENV production
ENV SKIP_ENV_VALIDATION true
ENV EMAIL_FROM envless@example.com

USER node

CMD ["start", "--filter=platform"]
