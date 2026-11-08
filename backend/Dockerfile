# 希燃呀开发者平台后端 Dockerfile
# ---------- 构建阶段 ----------
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
# 先单独拉依赖，pom 不变时可复用缓存层
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---------- 运行阶段 ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ENV TZ=Asia/Shanghai \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom"
RUN apk add --no-cache tzdata wget \
    && addgroup -S app && adduser -S app -G app
COPY --from=builder /app/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
