# Xiran Platform

A developer-focused platform that aggregates tools, articles, tutorials, projects, and error solutions.

- **Frontend**: Vue 3 + Vite + Pinia + Vue Router
- **Backend**: Spring Boot 3 + MyBatis Plus + JWT + Spring Security
- **Database**: MySQL 8 + Redis
- **Deployment**: Docker / Nginx / systemd

## Features

- Developer toolbox with backend execution support
- Technical articles, tutorials, and project showcases
- Error knowledge base and solutions
- Full-site search and hot search
- User center (bookmarks, history, subscriptions, saved configs)
- JWT authentication with RBAC admin roles
- Admin dashboard for ADMIN / EDITOR roles
- SEO optimization (sitemap, meta tags, static pages)

## Project Structure

```text
.
├── backend/          # Spring Boot backend
│   ├── src/main/java/com/xiran/platform/...
│   ├── src/main/resources/db/migration/    # Database migrations
│   └── Dockerfile
├── indexPage/        # Vue 3 frontend
│   ├── src/...
│   ├── public/
│   └── package.json
├── DEPLOY.md         # Production deployment guide
├── docker-compose.yml
└── README.md
```

## Quick Start

### Requirements

- JDK 21
- Maven 3.9+
- Node.js 22 LTS
- MySQL 8.0+
- Redis 6.x / 7.x

### 1. Clone the project

```bash
git clone https://github.com/Xiranwuxianxi/indexPage.git
```

### 2. Start databases

```bash
# Start MySQL + Redis with Docker Compose
docker-compose up -d mysql redis
```

### 3. Start backend

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend runs at `http://localhost:8080`.

### 4. Start frontend

```bash
cd indexPage
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Production Deployment

See [DEPLOY.md](./DEPLOY.md).

## API Documentation

Once the backend is running, open:

```text
http://localhost:8080/swagger-ui.html
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
