# ── Stage 1: Build ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ── Stage 2: Serve with nginx ─────────────────────────────────────────────────
FROM nginx:alpine

RUN addgroup -S app && adduser -S app -G app && \
    chown -R app:app /usr/share/nginx/html && \
    chown -R app:app /var/cache/nginx && \
    touch /var/run/nginx.pid && chown app:app /var/run/nginx.pid

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]