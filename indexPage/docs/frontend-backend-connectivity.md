---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: f383ea40b2ec70eabd75dbd495bb1587_d5f2eb2aa46811f1abe1525400e6dd8f
    ReservedCode1: oUbRMKbTOTr/OcGUj5/71IMeU+47JowIK8HLk+kI00cb+tszrby4MPSnxz9D7fgwZAftmOY6DT6agpYGfXl/B7T0Fa55TXcrPHtVflU1psq765wac8PmLXu3uL30Z5F1Y8b7O37Ej+Z0wkdLeUu6yIsEe+kYtSKAoEUzjXnvlVa7Je5QY9mRiDQ+YJ4=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: f383ea40b2ec70eabd75dbd495bb1587_d5f2eb2aa46811f1abe1525400e6dd8f
    ReservedCode2: oUbRMKbTOTr/OcGUj5/71IMeU+47JowIK8HLk+kI00cb+tszrby4MPSnxz9D7fgwZAftmOY6DT6agpYGfXl/B7T0Fa55TXcrPHtVflU1psq765wac8PmLXu3uL30Z5F1Y8b7O37Ej+Z0wkdLeUu6yIsEe+kYtSKAoEUzjXnvlVa7Je5QY9mRiDQ+YJ4=
---

# 希燃呀开发者平台：前后端联通讲解

> 项目结构：前端 `E:\InPageAllproject\indexPage`（Vue 3 + Vite + Pinia），后端 `E:\InPageAllproject\backend`（Spring Boot 3 + Spring Security + MyBatis Plus + MySQL/Redis）。
> 本文通读两端源码后整理，覆盖请求入口、调用链映射、代理与跨域、认证链路、统一返回结构与 DTO 转换。

---

## 1. 总体架构

```
┌────────────────────────────────────────────────────────────────┐
│                        浏览器 / 移动端                          │
└───────────────▲────────────────────────────────────────────────┘
                │ 1. 页面组件 → Pinia Store
                │ 2. Store 调用 src/api/client.js（fetch 封装）
                │ 3. client.js 注入 Bearer Token、拼 baseURL
                ▼
┌────────────────────────────────────────────────────────────────┐
│  Vite Dev Server (:5173)   │   Nginx（生产，转发 /api → 8080） │
└───────────────▲────────────────────────────────────────────────┘
                │ http://localhost:8080/api/v1/...
                ▼
┌────────────────────────────────────────────────────────────────┐
│  Spring Boot (:8080)                                          │
│  Security 过滤链 → Controller → Service → Mapper(MyBatis Plus) │
│  统一返回 ApiResponse{code,message,data,requestId,timestamp}    │
└────────────────────────────────────────────────────────────────┘
```

- **开发环境**：Vite 前端把 `VITE_API_BASE_URL` 指向 `http://localhost:8080/api/v1`，直连后端（`.env.example` 默认值），未配置 Vite proxy，靠后端 `WebConfig` 的 CORS 放行跨域。
- **生产环境**：前端静态资源由 Nginx 托管，`/api/` 反向代理到后端 8080，走同源避免 CORS。

---

## 2. 前端请求入口：client.js 与 endpoints.js

### 2.1 endpoints.js —— 接口路径的集中声明

`src/api/endpoints.js` 是前后端接口的"唯一事实来源"，所有路径写死为 `/api/v1/...`，与后端 Controller 的 `@RequestMapping` 一一对应。模块划分：

| 前端常量 | 实际路径 | 后端 Controller |
|---|---|---|
| `HOME` | `GET /api/v1/home` | HomeController |
| `TOOLS` / `TOOL_DETAIL(slug)` / `TOOL_EXEC(slug)` | `GET /api/v1/tools` / `GET /api/v1/tools/{slug}` / `POST /api/v1/tools/{slug}/exec` | ToolController |
| `ERRORS` / `ERROR_DETAIL(slug)` | `GET /api/v1/errors` / `GET /api/v1/errors/{slug}` | ErrorSolutionController |
| `ARTICLES` / `ARTICLE_DETAIL(slug)` | `GET /api/v1/articles` / `GET /api/v1/articles/{slug}` | ArticleController |
| `PROJECTS` / `PROJECT_DETAIL(slug)` | `GET /api/v1/projects` / `GET /api/v1/projects/{slug}` | ProjectController |
| `SEARCH` / `HOT_SEARCHES` | `GET /api/v1/search?q=` / `GET /api/v1/search/hot` | SearchController |
| `TUTORIALS` | `GET /api/v1/tutorials` | TutorialController |
| `AUTH_LOGIN` / `AUTH_GITHUB` / `AUTH_REFRESH` / `AUTH_LOGOUT` | `POST /api/v1/auth/...` | AuthController |
| `USER_ME` / `USER_BOOKMARKS` / `USER_HISTORY` / `USER_SAVED_CONFIGS` | `GET /api/v1/user/...` | UserController |

### 2.2 client.js —— 统一的请求封装

`src/api/client.js` 基于浏览器原生 `fetch` 封装（未用 axios），核心机制：

1. **baseURL**：`import.meta.env.VITE_API_BASE_URL || '/api/v1'`，与端点路径拼接后发起请求。
2. **Mock 切换机制**：读取 `VITE_USE_MOCK === 'true'` 时，`api` 导出为 `mockApiWrapper`，全部走 `src/api/mock/index.js` 的假数据（`execTool` 额外 catch 保证不抛错）；否则导出 `realApi` 走真实后端。
3. **Token 注入**：请求前从 `localStorage` 取 `xiran_token`，有值则加 `Authorization: Bearer <token>` 请求头（对应后端 `JwtAuthenticationFilter` 的解析格式）。
4. **统一错误处理**：
   - HTTP 401 → 清空 token 与 refreshToken，派发全局 `xiran:unauthorized` 事件（App 层可监听做登出跳转），抛"会话过期"错误。
   - 业务层：解析 JSON 后检查 `body.code !== 200` 则抛出带 `code`/`data` 的错误对象，保证 Store 里 `catch` 能拿到业务错误信息。
5. **返回解包**：成功时直接返回 `body.data`，Store 无需关心外层包装结构。

---

## 3. 前端调用链：Store → client → Controller 映射表

前端所有业务页面通过 Pinia Store 调 `api.*`，每个方法都能精确对应后端某个 Controller 接口：

| 前端模块 | Store 方法 | client 方法 | 方法/路径 | 后端 Controller → 方法 |
|---|---|---|---|---|
| **首页聚合** | `home.fetchHome()` | `getHome()` | `GET /api/v1/home` | `HomeController.home()`（一次返回 hero/热门工具/常见错误/精选项目/最新文章/技术方向） |
| **工具** | `tool.fetchTools()` | `getTools(params)` | `GET /api/v1/tools?page&size` | `ToolController.list()` |
| | `tool.fetchTool(slug)` | `getTool(slug)` | `GET /api/v1/tools/{slug}` | `ToolController.detail()` |
| | （工具页组件） | `execTool(slug, payload)` | `POST /api/v1/tools/{slug}/exec` | `ToolController.execute()` |
| **报错方案** | `error.fetchErrors()` | `getErrors(params)` | `GET /api/v1/errors?page&size` | `ErrorSolutionController.list()` |
| | `error.fetchError(slug)` | `getError(slug)` | `GET /api/v1/errors/{slug}` | `ErrorSolutionController.detail()` |
| **文章** | `article.fetchArticles()` | `getArticles(params)` | `GET /api/v1/articles?page&size` | `ArticleController.list()` |
| | `article.fetchArticle(slug)` | `getArticle(slug)` | `GET /api/v1/articles/{slug}` | `ArticleController.detail()` |
| **项目** | `project.fetchProjects()` | `getProjects(params)` | `GET /api/v1/projects?page&size` | `ProjectController.list()` |
| | `project.fetchProject(slug)` | `getProject(slug)` | `GET /api/v1/projects/{slug}` | `ProjectController.detail()` |
| **搜索** | `search.search()` | `search(params)` | `GET /api/v1/search?q=` | `SearchController.search()` |
| | `search.fetchHotSearches()` | `getHotSearches()` | `GET /api/v1/search/hot` | `SearchController.hotSearches()` |
| **认证** | `user.login(credentials)` | `login(credentials)` | `POST /api/v1/auth/login` | `AuthController.login()` |
| | `user.logout()` | `logout()` | `POST /api/v1/auth/logout` | `AuthController.logout()` |
| **用户中心** | `user.fetchProfile()` | `getMe()` | `GET /api/v1/user/me` | `UserController.getMe()` |
| | —（client 已声明） | `getBookmarks()` | `GET /api/v1/user/bookmarks` | `UserController.bookmarks()` |
| | —（client 已声明） | `getHistory()` | `GET /api/v1/user/history` | `UserController.history()` |
| | —（client 已声明） | `getSavedConfigs()` | `GET /api/v1/user/saved-configs` | `UserController.savedConfigs()` |
| **教程** | —（client 已声明） | `getTutorials()` | `GET /api/v1/tutorials` | `TutorialController.categories()` |
| **管理后台** | —（前端未封装 client） | — | `GET /api/v1/admin/dashboard` / `GET /api/v1/admin/stats/tools` | `AdminController.dashboard()` / `toolStats()` |

> 说明：
> - 前端 Store 的 getter（如 `tool.hotTools`、`article.latestArticles`、`project.featuredProjects`）是对已拉取列表在前端做 `slice` 截取，并非单独请求。
> - `getTutorials`、`getBookmarks`、`getHistory`、`getSavedConfigs` 在 client.js 中已声明，但当前页面未绑定调用；后端也已就绪（部分返回空列表占位）。
> - `AdminController` 需要 ADMIN/EDITOR 角色，前端当前未在 client.js 中封装对应方法。

### 3.1 一次典型请求的完整链路（以首页为例）

```
HomeView.vue  onMounted → home.fetchHome()
   │
   ▼
useHomeStore.fetchHome()  （src/stores/home.js）
   │   调 api.getHome()
   ▼
client.js  getHome() = request(ENDPOINTS.HOME)
   │   拼 baseURL = http://localhost:8080/api/v1
   │   注入 Authorization: Bearer <token>（若有）
   │   fetch GET /api/v1/home
   ▼
Spring Boot  Security 过滤链（JWT 校验，可选） → HomeController.home()
   │   toolService.listHot(6) + errorSolutionService.list(1,3)
   │   + projectService.listFeatured(3) + articleService.listLatest(3)
   ▼
ApiResponse.success({hero, hotTools, commonErrors, featuredProjects, latestArticles, focusAreas})
   │
   ▼
client.js  判断 body.code===200 → 返回 body.data
   │
   ▼
HomeStore  this.hotTools = data.hotTools 等 → 页面模板渲染
```

---

## 4. 代理与跨域

### 4.1 开发环境（Vite）

`vite.config.js` **未配置** `server.proxy`。前端通过 `VITE_API_BASE_URL=http://localhost:8080/api/v1` 直接跨域请求后端，依赖后端 CORS 配置放行。

### 4.2 后端 CORS（WebConfig）

`src/main/java/.../common/config/WebConfig.java`：

- 匹配路径：`/api/**`
- 允许来源：`xiran.cors.allowed-origins`（来自 `application.yml`，默认 `*`，可用 `XIRAN_CORS_ALLOWED_ORIGINS` 环境变量覆盖，逗号分隔多源）
- 方法：GET/POST/PUT/PATCH/DELETE/OPTIONS
- 允许头：`*`；暴露头：`Authorization`、`X-Request-Id`
- `allowCredentials(true)`、预检缓存 `maxAge(3600)`

> 注意：`allowedOrigins(*)` 与 `allowCredentials(true)` 同时使用时需依赖 Spring 的 `allowedOriginPatterns`（本项目已用 `allowedOriginPatterns`，正确写法）。

### 4.3 生产环境（Nginx 建议）

项目内未附带 nginx 配置（仓库内仅有后端 `nginx` 业务模块目录，非部署配置）。生产部署标准做法：

```nginx
# 前端静态资源（Vite build 产物 dist/）
server {
    listen 80;
    server_name example.com;
    root /var/www/indexPage/dist;
    index index.html;

    # Vue history 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理到 Spring Boot
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

> 前端生产构建时应将 `VITE_API_BASE_URL` 设为 `/api/v1`（同源），由 Nginx 把 `/api` 转发到后端，从而避免 CORS。后端 `application-prod.yml` 建议把 `xiran.cors.allowed-origins` 配成具体域名而非 `*`。

---

## 5. 认证链路

```
用户输入邮箱密码
   │
   ▼
user.login() → client.login() → POST /api/v1/auth/login  （AuthController.login → AuthService.login）
   │
   ▼
AuthService.login:
   AuthenticationManager.authenticate(UsernamePasswordAuthenticationToken(email, password))
   │   ↓ UserDetailsServiceImpl（按 email 查 User，BCrypt 校验密码）
   │   成功 → 查 User 记录 → convertToProfile()
   ▼
JwtUtil.generateAccessToken(userId, email, role)   // HS256，1 小时
JwtUtil.generateRefreshToken(userId, email)        // HS256，7 天
   │
   ▼
返回 TokenResponse{ accessToken, refreshToken, expiresIn, user }
   │
   ▼
user store:
   localStorage.setItem('xiran_token', accessToken)
   localStorage.setItem('xiran_refresh_token', refreshToken)
   │
   ▼ 此后每个请求：
client.js 自动注入  Authorization: Bearer <accessToken>
   │
   ▼
后端 JwtAuthenticationFilter（UsernamePasswordAuthenticationFilter 之前）：
   1. 从请求头取 Authorization，剥掉 "Bearer " 前缀
   2. jwtUtil.validateToken(token)（过期/签名/格式校验）
   3. 解析 Claims（subject=userId, claim role）
   4. userDetailsService.loadUserByUserId(userId) 载入用户
   5. 组装 ROLE_<role> 权限 → 写入 SecurityContextHolder
   ▼
SecurityConfig 授权规则：
   /api/v1/auth/**          → permitAll
   GET /home /tools /errors /articles /projects /search /tutorials → permitAll（公开读）
   /api/v1/admin/**         → 需 ROLE_ADMIN 或 ROLE_EDITOR
   /api/v1/user/**          → 需认证
   /api/v1/tools/*/exec    → POST，落在 anyRequest().authenticated() → 需认证
   ▼
失败处理：
   - 未认证 → JwtAuthenticationEntryPoint → ApiResponse 401
   - 权限不足 → JwtAccessDeniedHandler → ApiResponse 403
   - 前端收到 HTTP 401 → 清 token、触发 xiran:unauthorized、引导重新登录
```

要点：

- **无状态**：`SessionCreationPolicy.STATELESS`，不建 session，每请求独立解析 JWT。
- **密钥**：`XIRAN_JWT_SECRET` 环境变量注入，未配置启动即抛错（JwtUtil.getSecretKey）。
- **双 Token**：access 1 小时 / refresh 7 天；refresh 接口后端当前返回 501 占位，前端 `user.js` 目前只在登录时保存 refreshToken，尚未实现自动续期（Phase 4 预留）。
- **退出**：`logout` 当前后端直接返回成功，未做黑名单（Phase 4 预留）；前端 `user.logout()` 负责清空本地 token 与状态。

---

## 6. 数据返回结构与 DTO 转换

### 6.1 统一响应 ApiResponse

所有接口（成功/失败）都返回：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "requestId": "uuid",
  "timestamp": 1725000000000
}
```

- `code=200` 表示业务成功；错误时 `code=400/401/403/500/501` 等，`message` 为人类可读提示。
- `requestId` 为每个响应自动生成的 UUID，便于日志追踪；`timestamp` 为毫秒时间戳。
- 前端 `client.js` 以 `body.code !== 200` 判定失败并抛出带 `code`/`data` 的错误，Store 捕获后写入 `state.error`。

### 6.2 全局异常兜底

`GlobalExceptionHandler`（@RestControllerAdvice）把异常统一转成 ApiResponse：

| 异常 | HTTP/业务码 | 消息 |
|---|---|---|
| `BusinessException` | 自定义 code | 业务提示 |
| `MethodArgumentNotValidException` / `BindException` | 400 | 字段校验拼接 |
| `BadCredentialsException` | 401 | 用户名或密码错误 |
| `AccessDeniedException` | 403 | 权限不足 |
| 未知异常 | 500 | 系统繁忙，请稍后重试 |

### 6.3 Entity → DTO 转换

后端严格遵循 **Entity（表结构）与 Response（前端视图）分离**，Service 内统一 `convertToResponse()`：

| Service | 输入 Entity | 输出 DTO | 关键转换 |
|---|---|---|---|
| `ToolService` | `Tool`（categoryId 外键） | `ToolResponse` | categoryId → category 名称；拼接 `href=/tools/{slug}`；tags 暂为空 |
| `ProjectService` | `Project` + `ProjectTag` | `ProjectResponse` | status 枚举 → statusText（online/active/offline/archived）；techStack 逗号串 → 数组；href 取 demoUrl 或内部路由 |
| `ArticleService` | `Article` + 关联 Tag/User | `ArticleResponse` | categoryId → 名称；tags 多表查询；authorId → 昵称；`href=/articles/{slug}` |
| `ErrorSolutionService` | `ErrorSolution` | `ErrorSolutionResponse` | `href=/errors/{category}/{slug}` |
| `UserService` | `User` | `UserProfileResponse` | 字段与前端 user store 对齐（id/username/nickname/email/avatar/bio/role/subscribed/github/createdAt） |
| `AuthService` | `User` + JWT | `TokenResponse` | accessToken/refreshToken/expiresIn/user 一次返回 |

分页统一用 MyBatis Plus 的 `Page<T>`（含 `records/total/current/size`），前端 Store 取 `data.list`（实为 `Page.records`）渲染。

---

## 7. 常见问题排查要点

| 现象 | 定位方向 |
|---|---|
| 前端 404 / 拿不到数据 | 检查 `VITE_API_BASE_URL` 是否指向后端；生产是否配了 Nginx `/api` 代理 |
| 跨域报错 | 检查后端 `WebConfig` 的 `xiran.cors.allowed-origins` 是否包含前端源 |
| 401 后一直跳登录 | 检查 token 是否过期（1h）；refresh 接口尚未实现自动续期 |
| 登录报"用户名或密码错误" | 检查 `AuthService` 的 BCrypt 校验、`UserDetailsServiceImpl` 查询逻辑 |
| 管理后台 403 | 确认 JWT 中 role 为 ADMIN/EDITOR，且走 `/api/v1/admin/**` |
| mock 与真实数据不一致 | 确认 `VITE_USE_MOCK` 为 false；两端路径以 `endpoints.js` 与 Controller 为准 |

---

## 8. 首页小组件模块（widgets）前后端联通

首页新增三板块：**平台入口（PLATFORMS）**、**实用工具（UTILITIES）**、**全球时间与天气（WORLD CLOCK & WEATHER）**。数据统一通过后端 `widget` 模块接口下发，前端不做硬编码。

### 8.1 后端接口清单

模块包：`com.xiran.platform.widget`（controller / service / dto 三层），全部为 GET 公开接口，`SecurityConfig` 已在 `/api/v1/widgets/**` 白名单内。

| 方法 | 路径 | 说明 | 返回 |
|---|---|---|---|
| GET | `/api/v1/widgets` | 平台入口 + 实用工具列表（静态数据） | `{ platforms: [...], utilities: [...] }` |
| GET | `/api/v1/widgets/world-clock` | 北京/伦敦/纽约三地当前时间（java.time） | `{ updatedAt, cities: [{key,city,country,timezone,localTime,utcOffset}] }` |
| GET | `/api/v1/widgets/weather?city=beijing\|london\|newyork` | 指定城市天气（open-meteo 代理） | `WeatherResponse`（见下） |

- **世界时间**：`WidgetService.getWorldClock()` 用 `Instant.now()` + `ZoneId`（`Asia/Shanghai` / `Europe/London` / `America/New_York`）生成三地 `localTime`（`yyyy-MM-dd HH:mm:ss`）与 `utcOffset`。
- **天气**：`WidgetService.getWeather(city)` 按城市映射经纬度调用 `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current_weather=true`，解析 `current_weather` 并映射 WMO weather code → 中文描述 + emoji。

**天气降级方案（重要）**：若外网不可达 / 超时 / 非 200 / 响应缺字段，`fetchFromOpenMeteo()` 返回 `null`，由 `getWeather()` 回落到 `FALLBACK_WEATHER` 固定兜底数据（`source = "fallback"`，北京 26°C 晴 / 伦敦 15°C 局部多云 / 纽约 22°C 基本晴朗）。**接口绝不抛 500**；前端正常渲染，可通过 `weather.source` 判断数据来源。

`WeatherResponse` 字段：`city / cityName / country / temperature / unit / weatherCode / description / icon / windSpeed / source / observedAt`。

### 8.2 前端链路

| 文件 | 职责 |
|---|---|
| `src/api/endpoints.js` | 新增 `WIDGETS` / `WORLD_CLOCK` / `WEATHER(city)` 端点 |
| `src/api/client.js` | realApi 与 mockApiWrapper 各新增 `getWidgets / getWorldClock / getWeather` |
| `src/api/mock/index.js` | 新增 `mockPlatforms / mockUtilities / mockWorldClock / mockWeather` 及对应 mockApi 方法（`VITE_USE_MOCK=true` 可完整演示） |
| `src/stores/widgets.js` | 新增 Pinia store：`fetchWidgets / fetchWorldClock / fetchWeather / fetchAll`，state 含 `platforms / utilities / worldClock / weather / loading / error` |
| `src/components/widgets/PlatformGrid.vue` | 三张平台外链卡片（`<a target="_blank" rel="noopener">`） |
| `src/components/widgets/UtilitiesBoard.vue` | 五个内联小工具（时间戳 / Base64 / JSON / 随机密码 / 颜色），点开即用，无需路由 |
| `src/components/widgets/WorldClockBoard.vue` | 三地时间卡 + 天气（合并 worldClock 与 weather 数据） |
| `src/views/HomeView.vue` | 挂载 `useWidgetStore()`，`onMounted` 调 `widget.fetchAll()`，新增三个板块并接入 `AppSkeleton/ErrorMessage` 兜底 |

**调用顺序**：`HomeView onMounted → widget.fetchAll() → Promise.all([fetchWidgets, fetchWorldClock, fetchWeather])`，三个接口并行请求；天气按 `['beijing','london','newyork']` 逐城市调用并组装 `{ city: WeatherResponse }` 映射。

**注意**：`widgets` store 与 `home` store 各自维护 `loading / error`，模板中用 `widget.loading` 渲染骨架、`widget.error` 触发 `ErrorMessage`，避免与首页原有加载态混淆。

*（内容由AI生成，仅供参考）*
