# Xiran Platform Deployment Guide

This guide covers deploying the xiran-platform full-stack project to a production server.

- Backend: `backend/` (Spring Boot 3 + Maven + Java 21)
- Frontend: `indexPage/` (Vue 3 + Vite + Node.js 22)
- Database: MySQL 8 + Redis
- Optional: MinIO (for file uploads / avatars)

## 1. Environment Requirements

| Software | Version | Purpose |
|---|---|---|
| JDK | 21 | Run Spring Boot |
| Maven | 3.9.x | Build backend |
| MySQL | 8.0+ | Business data |
| Redis | 6.x / 7.x | Cache, session, rate limit |
| Node.js | 22.x LTS | Build frontend |
| Nginx | 1.24+ | Reverse proxy + static files |

## 2. Production Configuration

Set these environment variables on the server:

```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=xiran_platform
MYSQL_USER=xiran
MYSQL_PASSWORD=your_strong_password
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_or_empty
XIRAN_JWT_SECRET=at_least_32_random_characters
XIRAN_ACCESS_TOKEN_EXPIRATION=3600000
XIRAN_REFRESH_TOKEN_EXPIRATION=604800000
XIRAN_CORS_ALLOWED_ORIGINS=https://xiran.example.com
```

## 3. Database Setup

Create database `xiran_platform` with `utf8mb4` charset.
Create user `xiran` and grant all privileges on `xiran_platform`.*.

Migration files are in `backend/src/main/resources/db/migration/`:

- `V1__init_schema.sql`
- `V2__init_data.sql`

For first deploy, set `spring.sql.init.mode=always` in `application-prod.yml`, then change to `never`.

## 4. Backend Deployment

Create `backend/src/main/resources/application-prod.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/${MYSQL_DB:xiran_platform}?useUnicode=true&characterEncoding=utf8mb4&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false
    username: ${MYSQL_USER:xiran}
    password: ${MYSQL_PASSWORD:}
    driver-class-name: com.mysql.cj.jdbc.Driver
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
  sql:
    init:
      mode: never
server:
  port: 8080
xiran:
  jwt:
    secret: ${XIRAN_JWT_SECRET:}
    access-token-expiration: ${XIRAN_ACCESS_TOKEN_EXPIRATION:3600000}
    refresh-token-expiration: ${XIRAN_REFRESH_TOKEN_EXPIRATION:604800000}
  cors:
    allowed-origins: ${XIRAN_CORS_ALLOWED_ORIGINS:}
```

> Note: `xiran.jwt.secret` must be set, otherwise startup fails.

Build and run:

```bash
cd /opt/xiran-platform/backend
mvn -DskipTests clean package
java -jar -Dspring.profiles.active=prod target/xiran-platform-*.jar
```

Linux systemd service example (`/etc/systemd/system/xiran-backend.service`):

```ini
[Unit]
Description=Xiran Platform Backend
After=network.target mysql.service redis.service

[Service]
Type=simple
User=www
WorkingDirectory=/opt/xiran-platform/backend
Environment="MYSQL_HOST=localhost"
Environment="MYSQL_PORT=3306"
Environment="MYSQL_DB=xiran_platform"
Environment="MYSQL_USER=xiran"
Environment="MYSQL_PASSWORD=your_strong_password"
Environment="REDIS_HOST=localhost"
Environment="REDIS_PORT=6379"
Environment="XIRAN_JWT_SECRET=your_jwt_secret"
Environment="XIRAN_ACCESS_TOKEN_EXPIRATION=3600000"
Environment="XIRAN_REFRESH_TOKEN_EXPIRATION=604800000"
Environment="XIRAN_CORS_ALLOWED_ORIGINS=https://xiran.example.com"
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /opt/xiran-platform/backend/target/xiran-platform-*.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

Then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable xiran-backend
sudo systemctl start xiran-backend
```

## 5. Frontend Deployment

Install dependencies and build:

```bash
cd /opt/xiran-platform/indexPage
cp .env.example .env.production
# Edit .env.production: VITE_API_BASE_URL=https://xiran.example.com/api/v1
npm ci
npm run build
```

Build output is at `indexPage/dist/`.

Nginx configuration:

```nginx
server {
    listen 80;
    server_name xiran.example.com;

    location / {
        root /opt/xiran-platform/indexPage/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable HTTPS with Certbot:

```bash
sudo certbot --nginx -d xiran.example.com
```

## 6. Verification

```bash
curl https://xiran.example.com/api/v1/home
```

Expected response:

```json
{"code":200,"message":"success","data":{"hotTools":[...],"latestArticles":[...]}}
```

Browser URLs:

- Home: `https://xiran.example.com/`
- Tools: `https://xiran.example.com/tools`
- Articles: `https://xiran.example.com/articles`
- Login: `https://xiran.example.com/login`

## 7. Common Issues

| Issue | Solution |
|---|---|
| `Access denied for user` | Check MySQL user/password and privileges. |
| `XIRAN_JWT_SECRET is empty` | Set a JWT secret of at least 32 characters. |
| Login lost after refresh | Check `localStorage` token and Nginx `Authorization` header. |
| CORS error | Add frontend domain to `XIRAN_CORS_ALLOWED_ORIGINS`. |
| 404 on page refresh | Add `try_files $uri $uri/ /index.html;` in Nginx. |
| Garbled database text | Use `utf8mb4` for database and connection URL. |

## 8. Future Extensions

- Integrate MinIO for avatar/image uploads
- Replace simple search with Elasticsearch or Meilisearch
- Add CDN for static assets
- Add Docker / Docker Compose one-click deployment
- Add centralized logging (ELK / Loki) and monitoring (Prometheus + Grafana)
