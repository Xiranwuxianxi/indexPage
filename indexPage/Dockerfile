# 前端运行镜像：Nginx 托管 frontend-builder 产出的静态站点，并同源反代 /api
FROM nginx:stable-alpine
ENV BACKEND_UPSTREAM=backend:8080 \
    NGINX_ENVSUBST_FILTER=^BACKEND_
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q --spider http://127.0.0.1/ || exit 1
