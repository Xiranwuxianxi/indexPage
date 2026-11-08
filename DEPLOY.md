# 部署指南

本项目由 **Vue 3 前端（`indexPage/`）** 和 **Spring Boot 后端（`backend/`）** 组成，依赖 MySQL 8 与 Redis。

两种部署方式的网络拓扑一致：**浏览器只访问前端 Nginx**，Nginx 托管静态页面，并把同源的 `/api/` 反向代理到后端 `8080`。前端代码里的接口地址是相对路径 `/api/v1/...`，所以不需要为前端单独配置后端地址，也不会遇到跨域问题。

```
浏览器 ──► 前端 Nginx :80 ──┬─► 静态文件（dist/，含 SEO 预渲染页）
                            └─► /api/*  ──► Spring Boot :8080 ──► MySQL :3306 / Redis :6379
```

- [方式一：Docker Compose（推荐）](#方式一docker-compose推荐)
- [方式二：原生部署（systemd + Nginx）](#方式二原生部署systemd--nginx)
- [通用：HTTPS、验证、排障](#通用https验证排障)

---

## 方式一：Docker Compose（推荐）

Compose 管理 5 个服务，**只有 `frontend` 对外暴露端口**，MySQL / Redis / 后端只在容器内网通信：

| 服务               | 作用                                                                    | 对外端口                            |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------- |
| `mysql`            | MySQL 8，首次启动自动执行 `backend/src/main/resources/db/migration/*.sql` | 无                                  |
| `redis`            | Redis 7（带密码、AOF 持久化）                                           | 无                                  |
| `backend`          | Spring Boot（`prod` profile）                                           | 无                                  |
| `frontend-builder` | 一次性任务：`npm run build`，从后端拉内容生成 SEO 页 / sitemap，写入共享卷 | 无                                  |
| `frontend`         | Nginx：静态站点 + `/api/` 反代到 `backend:8080`                          | `${FRONTEND_BIND}:${FRONTEND_PORT}` |

### 1. 准备服务器

安装 Docker Engine 和 Docker Compose plugin（`docker compose version` 能输出版本即可）。建议 2 核 4G 以上内存（构建阶段 Maven / npm 比较吃内存）。

```bash
cd /opt
git clone <repository-url> xiran-platform
cd /opt/xiran-platform
cp .env.example .env
```

### 2. 填写 `.env`

```bash
# 生成随机密钥的小技巧
openssl rand -base64 48
```

| 变量                                    | 说明                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `MYSQL_ROOT_PASSWORD` / `MYSQL_PASSWORD` | 数据库 root 与应用账号密码，**首次启动后再修改不会生效**（MySQL 只在空数据卷时初始化） |
| `REDIS_PASSWORD`                        | Redis 密码                                                                          |
| `XIRAN_JWT_SECRET`                      | JWT 签名密钥，**至少 32 个字符**，否则后端启动/登录报错                              |
| `XIRAN_CORS_ALLOWED_ORIGINS`            | 一般**留空**（前端同源访问）。只有其他域名要直接跨域调用后端时才填，逗号分隔         |
| `FRONTEND_BIND` / `FRONTEND_PORT`       | 前端对外监听地址和端口，见下表                                                       |

端口暴露的两种常见用法：

| 场景                                     | `FRONTEND_BIND` | `FRONTEND_PORT` | 访问方式                                   |
| ---------------------------------------- | --------------- | --------------- | ------------------------------------------ |
| 直接对外提供服务（最简单）               | `0.0.0.0`       | `80`            | `http://服务器IP/` 或 `http://域名/`         |
| 宿主机已有 Nginx/Caddy 负责 HTTPS 和域名 | `127.0.0.1`     | `8081`          | 外层反代到 `http://127.0.0.1:8081`（见下文） |

> 云服务器记得在安全组 / 防火墙放行 `FRONTEND_PORT`。其它端口都不需要放行。

### 3. 启动

```bash
docker compose up -d --build
```

启动顺序由健康检查自动保证：`mysql`、`redis` 健康 → `backend` 健康 → `frontend-builder` 构建完成 → `frontend` 启动。首次构建需要下载 Maven/npm 依赖，通常 3–10 分钟。

```bash
docker compose ps                      # backend / frontend 应为 healthy，frontend-builder 为 Exited (0)
docker compose logs -f backend         # 查看后端日志
curl -fsS http://127.0.0.1:${FRONTEND_PORT:-8081}/api/v1/home | head -c 200   # 经前端 Nginx 访问后端
```

浏览器打开 `http://服务器IP:FRONTEND_PORT/`。

**默认管理员账号**：`hello@xiranya.cn` / `xiran123`（来自初始化数据）。上线后请立即登录并修改密码，或直接在数据库中更新该账号的 BCrypt 密码。

### 4. 更新发布

```bash
cd /opt/xiran-platform
git pull
docker compose up -d --build
# 若 frontend-builder 没有因代码变化而重跑，可强制重新生成前端：
docker compose up --no-deps --build --force-recreate frontend-builder && docker compose restart frontend
```

只更新了文章等内容（没有代码变更）、想刷新 SEO 预渲染页和 sitemap 时，执行上面第二条命令即可。

### 5. 数据与备份

- MySQL、Redis 数据在 named volumes：`<COMPOSE_PROJECT_NAME>_mysql_data`、`<COMPOSE_PROJECT_NAME>_redis_data`，普通的重建镜像 / 替换容器不会删除它们。
- **不要**在日常发布中使用 `docker compose down -v`，`-v` 会删除数据库卷。
- 如果服务器以前已有旧版 Compose 的 MySQL 卷，先 `docker volume ls` 确认卷名，把 `.env` 的 `COMPOSE_PROJECT_NAME` 设成旧前缀以复用旧数据，并保证 `.env` 中的数据库密码与旧库一致。
- 备份：

```bash
docker compose exec mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction "$MYSQL_DATABASE"' > backup-$(date +%F).sql
```

### 6. GitHub Actions：CI 与部署

工作流文件：`.github/workflows/fullstack.yml`。

| 触发方式                                   | 做什么                                                     | 动服务器吗 |
| ------------------------------------------ | ---------------------------------------------------------- | ---------- |
| 推送任意分支、提 PR                        | 后端 `mvn verify`、前端测试+构建、Docker 镜像构建          | **不动**   |
| Actions 页面 → CI / Deploy → Run workflow   | 上面的检查全部通过后，SSH 到服务器执行 Compose 发布        | 部署       |
| 推送到 `main`/`master` 且仓库变量 `AUTO_DEPLOY=true` | 同上，推送即自动部署                              | 部署       |

**默认推送只做检查，不会部署。**确认手动部署没问题后，如果想要推送即上线，到 Settings → Secrets and variables → Actions → **Variables** 新建 `AUTO_DEPLOY`，值填 `true`。

部署步骤：检查 Secrets → 检查服务器已装 `docker compose` 且存在 `.env` → rsync 源码（不同步 `.env`、`.git`，不加 `--delete`）→ `docker compose up -d --build` → 重新生成前端静态文件 → 访问 `/api/v1/home` 做健康检查，失败时打印后端日志。数据卷不会被删除。

在 Settings → Secrets and variables → Actions → **Secrets** 配置：

| Secret               | 必填 | 内容                                                                    |
| -------------------- | ---- | ----------------------------------------------------------------------- |
| `DEPLOY_HOST`        | 是   | 服务器 IP 或域名                                                        |
| `DEPLOY_USER`        | 是   | SSH 用户，需能执行 `docker compose`（在 `docker` 组或是 root）            |
| `DEPLOY_KEY`         | 是   | 该用户的 SSH 私钥（公钥放在服务器 `~/.ssh/authorized_keys`）              |
| `APP_DEPLOY_PATH`    | 是   | Compose 项目目录，如 `/opt/xiran-platform`                              |
| `DEPLOY_PORT`        | 否   | SSH 端口，默认 22                                                       |
| `DEPLOY_KNOWN_HOSTS` | 否   | `ssh-keyscan -p 22 服务器IP` 的输出（核对过指纹）；不填则自动 keyscan 并给出警告 |

> 部署目录用的是新的 `APP_DEPLOY_PATH`，**刻意不复用**旧的 `DEPLOY_PATH`。旧值通常指向静态网站根目录（如 `/var/www/...`），把整个源码同步进去会把源码暴露到公网。

首次自动部署前，先在服务器上手动完成一次：创建 `APP_DEPLOY_PATH` 目录、放好 `.env`（见第 2 步）。

---

## 方式二：原生部署（systemd + Nginx）

以下以 Ubuntu 22.04 / Debian 12 为例，部署目录 `/opt/xiran-platform`，用户 `xiran`。CentOS / Rocky 把 `apt` 换成 `dnf`，Nginx 配置目录换成 `/etc/nginx/conf.d/` 即可。

### 1. 安装依赖

| 软件    | 版本要求          | 用途                   |
| ------- | ----------------- | ---------------------- |
| JDK     | **21**            | 运行 / 构建后端        |
| Maven   | 3.9+              | 构建后端               |
| Node.js | 22 LTS（≥22.12）  | 构建前端（运行时不需要） |
| MySQL   | 8.0+              | 数据库                 |
| Redis   | 6.x / 7.x         | 缓存                   |
| Nginx   | 1.18+             | 静态站点 + API 反代    |

```bash
sudo apt update
sudo apt install -y openjdk-21-jdk maven mysql-server redis-server nginx git
# Node.js 22（NodeSource）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

java -version && mvn -v && node -v
sudo useradd -r -m -d /opt/xiran-platform -s /usr/sbin/nologin xiran || true
```

### 2. 初始化 MySQL

```bash
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS xiran_platform DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'xiran'@'localhost' IDENTIFIED BY '替换为强密码';
GRANT ALL PRIVILEGES ON xiran_platform.* TO 'xiran'@'localhost';
FLUSH PRIVILEGES;
SQL

cd /opt/xiran-platform   # 先把代码 clone 到这里
mysql -uxiran -p xiran_platform < backend/src/main/resources/db/migration/V1__init_schema.sql
mysql -uxiran -p xiran_platform < backend/src/main/resources/db/migration/V2__init_data.sql
```

两个脚本使用 `CREATE TABLE IF NOT EXISTS` / `INSERT IGNORE`，重复执行是安全的。`prod` profile 不会自动执行 SQL，表结构只通过上面的命令导入。

### 3. 配置 Redis 密码

编辑 `/etc/redis/redis.conf`：

```conf
bind 127.0.0.1 ::1
requirepass 替换为强密码
```

```bash
sudo systemctl restart redis-server && sudo systemctl enable redis-server
```

### 4. 构建并运行后端

```bash
sudo git clone <repository-url> /opt/xiran-platform   # 若尚未 clone
sudo chown -R xiran:xiran /opt/xiran-platform
cd /opt/xiran-platform/backend
sudo -u xiran mvn -B clean package -DskipTests
sudo -u xiran cp target/xiran-platform-backend-*.jar /opt/xiran-platform/app.jar
```

创建环境变量文件 `/etc/xiran-platform.env`（权限 600，只有 root 可读）：

```bash
sudo tee /etc/xiran-platform.env >/dev/null <<'EOF'
SPRING_PROFILES_ACTIVE=prod
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DB=xiran_platform
MYSQL_USER=xiran
MYSQL_PASSWORD=替换为数据库密码
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=替换为Redis密码
XIRAN_JWT_SECRET=替换为至少32个字符的随机串
XIRAN_ACCESS_TOKEN_EXPIRATION=3600000
XIRAN_REFRESH_TOKEN_EXPIRATION=604800000
# 前端与后端同源，一般留空
XIRAN_CORS_ALLOWED_ORIGINS=
EOF
sudo chmod 600 /etc/xiran-platform.env
```

创建 systemd 服务 `/etc/systemd/system/xiran-backend.service`：

```ini
[Unit]
Description=Xiran Platform Backend (Spring Boot)
After=network.target mysql.service redis-server.service
Wants=mysql.service redis-server.service

[Service]
Type=simple
User=xiran
WorkingDirectory=/opt/xiran-platform
EnvironmentFile=/etc/xiran-platform.env
Environment=TZ=Asia/Shanghai
ExecStart=/usr/bin/java -XX:MaxRAMPercentage=60 -jar /opt/xiran-platform/app.jar
SuccessExitStatus=143
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now xiran-backend
sudo journalctl -u xiran-backend -f          # 看到 Started XiranPlatformApplication 即成功
curl -fsS http://127.0.0.1:8080/api/v1/home | head -c 200
```

> 后端只监听在本机由 Nginx 访问；防火墙**不要**放行 8080 / 3306 / 6379。

### 5. 构建前端

前端构建时会从后端拉取已发布内容生成 SEO 详情页与 sitemap，因此**先确保后端已启动**（后端不可达时构建不会失败，只是跳过动态页）。

```bash
cd /opt/xiran-platform/indexPage
sudo -u xiran npm ci
sudo -u xiran env PRERENDER_API_BASE=http://127.0.0.1:8080 VITE_API_BASE_URL= npm run build

sudo mkdir -p /var/www/xiran-platform
sudo rsync -a --delete dist/ /var/www/xiran-platform/
```

`VITE_API_BASE_URL` 留空表示浏览器请求同源 `/api/v1/...`，由 Nginx 转发到后端。**不要**在 `indexPage/.env` 中把它设成 `http://localhost:8080`，否则用户浏览器会去请求他自己电脑上的 8080。

### 6. 配置 Nginx

`/etc/nginx/sites-available/xiran-platform`：

```nginx
server {
    listen 80;
    server_name xiranya.cn www.xiranya.cn;   # 改成你的域名；没有域名可写 _

    root /var/www/xiran-platform;
    index index.html;
    client_max_body_size 20m;
    absolute_redirect off;

    gzip on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml image/svg+xml;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $http_host;
        proxy_read_timeout 60s;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location / {
        add_header Cache-Control "no-cache";
        try_files $uri $uri/index.html $uri/ /index.html;   # 预渲染页优先，其余走 Vue history 回退
    }
}
```

```bash
sudo ln -sf /etc/nginx/sites-available/xiran-platform /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

> `Host $http_host` 和 `X-Forwarded-*` 头必须保留：后端在 `prod` 下开启了 `server.forward-headers-strategy=framework`，靠这些头判断请求是否同源。缺少时，通过非 80 端口或 HTTPS 访问的登录等 POST 请求可能被判为跨域并返回 403。

### 7. 更新发布

```bash
cd /opt/xiran-platform && sudo -u xiran git pull

# 后端
cd backend && sudo -u xiran mvn -B clean package -DskipTests \
  && sudo -u xiran cp target/xiran-platform-backend-*.jar /opt/xiran-platform/app.jar \
  && sudo systemctl restart xiran-backend

# 前端（等后端启动完成后执行）
cd ../indexPage && sudo -u xiran npm ci \
  && sudo -u xiran env PRERENDER_API_BASE=http://127.0.0.1:8080 VITE_API_BASE_URL= npm run build \
  && sudo rsync -a --delete dist/ /var/www/xiran-platform/
```

---

## 本地开发

```bash
# 1. 启动 MySQL + Redis（本机安装或只用 Compose 起这两个）
# 2. 后端：dev profile 会在启动时自动执行建表与初始化数据
cd backend
cp .env.example .env     # 填写本机 MySQL/Redis 账号和 XIRAN_JWT_SECRET
mvn spring-boot:run      # http://localhost:8080 ，Swagger: /swagger-ui.html

# 3. 前端：Vite 把 /api 代理到 http://localhost:8080
cd indexPage
npm ci
npm run dev              # http://localhost:5173
```

开发时 `indexPage/.env` 的 `VITE_API_BASE_URL` 留空即可走 Vite 代理；设置 `VITE_USE_MOCK=true` 可完全脱离后端使用 mock 数据。

---

## 通用：HTTPS、验证、排障

### HTTPS

- **原生部署**：`sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d xiranya.cn -d www.xiranya.cn`。
- **Docker 部署**：把 `.env` 设为 `FRONTEND_BIND=127.0.0.1`、`FRONTEND_PORT=8081`，宿主机 Nginx 反代并用 certbot 签证书：

```nginx
server {
    listen 443 ssl http2;
    server_name xiranya.cn;
    # ssl_certificate / ssl_certificate_key 由 certbot 写入

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```

前端容器内的 Nginx 会沿用外层传入的 `X-Forwarded-Proto/Host`，后端因此能正确识别 `https://` 同源请求。使用 Cloudflare 等 CDN 时同理。

### 上线验证清单

```bash
BASE=http://127.0.0.1:8081   # 原生部署为 http://127.0.0.1
curl -fsS $BASE/ -o /dev/null -w "%{http_code}\n"            # 200 首页
curl -fsS $BASE/api/v1/home | head -c 200                     # {"code":200,...}
curl -fsS $BASE/tools -o /dev/null -w "%{http_code}\n"        # 200 SPA 深链接
curl -fsS $BASE/sitemap.xml | head -5
curl -fsS -X POST $BASE/api/v1/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"hello@xiranya.cn","password":"xiran123"}' | head -c 200   # 返回 accessToken
```

### 常见问题

| 现象                                       | 排查                                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 页面能开，数据全空 / 接口 502              | 后端没起来：`docker compose logs backend` 或 `journalctl -u xiran-backend`；检查数据库/Redis 密码、JWT 密钥      |
| 登录等 POST 返回 403 `Invalid CORS request` | 反代没传 `Host $http_host` / `X-Forwarded-*`；或前端被构建成直连其它域名的后端地址（检查 `VITE_API_BASE_URL`）   |
| 浏览器请求 `localhost:8080`                 | 构建时 `VITE_API_BASE_URL` 被设置了，留空后重新构建前端                                                         |
| 刷新子页面 404                             | Nginx 缺少 `try_files $uri $uri/index.html $uri/ /index.html;`                                                                 |
| 后端报 `Access denied for user`             | Docker：已有 MySQL 卷时修改 `.env` 密码不会生效，需要用旧密码或进库修改用户密码                                   |
| 详情页 SEO 预渲染没更新                     | 重新执行前端构建（Docker 见“更新发布”第二条命令）                                                               |

### 搜索引擎 / AI 爬虫

抓取策略由 `indexPage/public/robots.txt` 控制，`llms.txt` / `llms-full.txt` 供 AI 检索。Cloudflare 的 WAF、Bot Fight Mode 或 AI Crawl Control 可能在请求到达站点前拦截爬虫，需要在 Cloudflare 控制台单独放行。
