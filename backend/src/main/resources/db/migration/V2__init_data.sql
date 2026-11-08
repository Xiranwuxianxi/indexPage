SET NAMES utf8mb4;
-- 初始数据
-- 密码统一为：xiran123（BCrypt 加密）

INSERT IGNORE INTO `user` (`username`, `email`, `password`, `nickname`, `avatar`, `bio`, `role`, `subscribed`) VALUES
('xiran', 'hello@xiranya.cn', '$2a$10$g/.Tj.Is7nVscQR5sEYUV.VWnN12hmMK2MuiUJkrXuP/CnMto8IRm', '希燃呀', '/avatar.png', '探索底层逻辑，用代码重构世界。', 'ADMIN', 1),
('demo', 'demo@xiranya.cn', '$2a$10$g/.Tj.Is7nVscQR5sEYUV.VWnN12hmMK2MuiUJkrXuP/CnMto8IRm', '演示用户', '/avatar.png', '普通用户账号', 'USER', 0);

INSERT IGNORE INTO `category` (`name`, `slug`, `description`, `type`) VALUES
('部署与服务器', 'deployment', 'Nginx、OpenResty、Linux、Docker 等部署与服务器主题', 'article'),
('Java 后端', 'java', 'Spring Boot、Spring Security、JWT、MyBatis Plus 等', 'article'),
('Vue 前端', 'frontend', 'Vue 3、Vite、Vue Router、Axios、性能优化与 SEO', 'article'),
('AI 工程化', 'ai', 'Spring AI、LangChain4j、MCP、Agent、RAG、n8n', 'article'),
('部署', 'deploy', '部署相关工具', 'tool'),
('后端', 'backend', '后端开发工具', 'tool'),
('安全', 'security', '安全相关工具', 'tool'),
('SEO', 'seo', 'SEO 相关工具', 'tool'),
('运维', 'devops', '运维相关工具', 'tool');

-- 工具分类（tool 表 category_id 关联此表，id 与上方 category 表的工具分类对齐）
INSERT IGNORE INTO `tool_category` (`id`, `name`, `slug`, `description`) VALUES
(5, '部署', 'deploy', '部署相关工具'),
(6, '后端', 'backend', '后端开发工具'),
(7, '安全', 'security', '安全相关工具'),
(8, 'SEO', 'seo', 'SEO 相关工具'),
(9, '运维', 'devops', '运维相关工具');

INSERT IGNORE INTO `tool` (`name`, `slug`, `summary`, `description`, `category_id`, `icon`, `usage_count`, `sort_order`) VALUES
('Nginx 配置生成器', 'nginx-generator', '根据域名、HTTPS、反向代理等选项生成生产级 Nginx 配置。', '详细说明待补充', 5, '⚙️', 0, 1),
('Nginx 配置检查器', 'nginx-checker', '自动识别 Nginx 配置中的常见风险与错误。', '详细说明待补充', 5, '🔍', 0, 2),
('CORS 配置生成器', 'cors-generator', '为 Spring Boot、Nginx、Node.js 生成跨域配置。', '详细说明待补充', 6, '🌐', 0, 3),
('JWT 解析器', 'jwt-parser', '安全地解析 JWT Header、Payload 与 Signature。', '详细说明待补充', 7, '🔑', 0, 4),
('Sitemap 检查器', 'sitemap-checker', '检查 sitemap.xml 格式与 URL 可访问性。', '详细说明待补充', 8, '🗺️', 0, 5),
('Cron 表达式生成器', 'cron-generator', '用自然语言生成 Cron 表达式。', '详细说明待补充', 9, '⏰', 0, 6);

INSERT IGNORE INTO `article` (`title`, `slug`, `summary`, `markdown_content`, `html_content`, `cover`, `published_at`, `view_count`, `author_id`, `category_id`, `status`) VALUES
('Vue Router History 模式下 Nginx 刷新 404 的完整解决', 'vue-history-mode-nginx-404', '从 try_files 到 location 匹配优先级，彻底解决 Vue 项目部署后刷新 404。', '# 问题是什么\n\n待补充', '<h1>问题是什么</h1><p>待补充</p>', '/avatar.png', '2026-06-20 10:00:00', 0, 1, 3, 1),
('Spring Boot 3 CORS 配置避坑指南', 'spring-boot-cors-guide', '从 @CrossOrigin 到 CorsFilter，梳理前后端分离下的跨域实战方案。', '# 问题是什么\n\n待补充', '<h1>问题是什么</h1><p>待补充</p>', '/avatar.png', '2026-06-15 08:00:00', 0, 1, 2, 1),
('Nginx 反向代理 WebSocket 时容易遗漏的三个请求头', 'nginx-websocket-proxy-headers', 'Upgrade、Connection、X-Forwarded-For，以及为何 proxy_http_version 1.1 必不可少。', '# 问题是什么\n\n待补充', '<h1>问题是什么</h1><p>待补充</p>', '/avatar.png', '2026-06-10 14:00:00', 0, 1, 1, 1);

INSERT IGNORE INTO `project` (`name`, `slug`, `summary`, `description`, `cover`, `type`, `project_status`, `demo_url`, `repo_url`, `tech_stack`, `icon`, `sort_order`) VALUES
('C-Sandbox 在线编译', 'csandbox', '轻量级 C 语言在线编译环境。', '详细说明待补充', '/avatar.png', '工具', 'online', 'https://xiranya.cn/csandbox/', 'https://github.com/Xiranwuxianxi', 'Vue 3,Vite,WebAssembly,Docker', '⚡', 1),
('日记空间', 'diaries', '可以随手写日记、记录想法的私人写作空间。', '详细说明待补充', '/avatar.png', '日记', 'active', 'https://xiranya.cn/diaries/', NULL, 'Halo,MySQL,Nginx', '📓', 2),
('博客小栈', 'xiran-blog', '基于 Halo 构建的个人技术博客。', '详细说明待补充', '/avatar.png', '文章', 'active', 'https://halo.xiranya.cn/', NULL, 'Spring Boot,Halo,Vue 3', '📚', 3);

INSERT IGNORE INTO `error_solution` (`original_text`, `slug`, `title`, `category`, `summary`, `cause`, `scenario`, `wrong_example`, `correct_example`, `solution`, `verify_command`, `misunderstanding`, `related_tool_ids`, `related_article_ids`) VALUES
('The plain HTTP request was sent to HTTPS port', 'plain-http-sent-to-https-port', 'Nginx：HTTP 请求发送到 HTTPS 端口', 'nginx', 'Nginx 监听 HTTPS 端口，但客户端以 HTTP 协议访问。', '协议不匹配。', '本地开发或负载均衡配置错误。', 'listen 443 ssl;', 'listen 80; return 301 https://$host$request_uri;', '配置 HTTP 重定向。', 'curl -I http://example.com', '误以为端口冲突。', '1', '1'),
('the size of shared memory zone conflicts with already declared size', 'shared-memory-zone-conflicts', 'Nginx：共享内存区大小冲突', 'nginx', 'limit_req_zone 重复声明且 size 不一致。', '配置重复加载。', '多次 include 同一配置文件。', 'limit_req_zone $binary_remote_addr zone=one:10m;', 'limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;', '统一 zone 名称与大小。', 'nginx -t', '直接修改大小不检查重复。', '2', '1'),
('Refused to execute script because its MIME type is text/html', 'mime-type-text-html-for-script', '浏览器：脚本 MIME 类型为 text/html', 'vue', '前端资源路径错误，服务器返回了 404 HTML。', '静态资源路径或二级目录部署错误。', 'Vue 二级目录部署未配置 base。', 'try_files $uri $uri/ /index.html;', 'try_files $uri $uri/ /your-base/index.html;', '检查 base 与 Nginx root。', 'curl -I https://example.com/js/app.js', '以为是浏览器缓存。', '1', '2');

INSERT IGNORE INTO `nginx_rule` (`code`, `level`, `title`, `description`, `suggestion`, `example_before`, `example_after`, `tutorial_url`) VALUES
('NGINX_PROXY_PASS_TRAILING_SLASH', 'WARNING', 'proxy_pass 尾部斜杠问题', 'proxy_pass 尾部斜杠会影响 location 转发路径。', '根据是否需要保留路径选择是否加斜杠。', 'proxy_pass http://backend/;', 'proxy_pass http://backend;', '/articles/vue-history-mode-nginx-404'),
('NGINX_TRY_FILES_API', 'ERROR', 'try_files 导致 API 返回 HTML', 'API 前缀未正确配置 try_files，导致 API 404 返回 index.html。', '为 API location 单独配置 proxy_pass，不经过 try_files。', 'location / { try_files $uri $uri/ /index.html; }', 'location /api/ { proxy_pass http://backend/; }', '/articles/vue-history-mode-nginx-404'),
('NGINX_WEBSOCKET_HEADERS', 'ERROR', 'WebSocket 请求头缺失', '反向代理 WebSocket 时缺少 Upgrade 与 Connection 头。', '添加 proxy_set_header Upgrade 与 Connection。', 'proxy_pass http://backend/ws;', 'proxy_set_header Upgrade $http_upgrade;\nproxy_set_header Connection "upgrade";', '/articles/nginx-websocket-proxy-headers');
