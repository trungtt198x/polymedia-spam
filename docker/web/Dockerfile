FROM node:20-alpine AS builder

# Install corepack and pnpm
RUN corepack enable
RUN npm install -g corepack@latest
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root dir files
COPY eslint.config.mjs ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY turbo.json ./

# Copy "sdk" as shared lib files
COPY src/sdk/ ./src/sdk/

# Copy "web" as web app files
COPY src/web/ ./src/web/

RUN pnpm install --frozen-lockfile

RUN pnpm build

# Install and config nginx
FROM nginx:alpine

COPY --from=builder /app/src/web/dist /usr/share/nginx/html

COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
