package com.xiran.platform.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 工具类
 *
 * 负责 Access Token 与 Refresh Token 的生成、解析与校验。
 * 密钥通过环境变量注入，禁止硬编码。
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${xiran.jwt.secret:}")
    private String jwtSecret;

    @Value("${xiran.jwt.access-token-expiration:3600000}")
    private Long accessTokenExpiration;

    @Value("${xiran.jwt.refresh-token-expiration:604800000}")
    private Long refreshTokenExpiration;

    private SecretKey getSecretKey() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("JWT 密钥未配置，请设置环境变量 XIRAN_JWT_SECRET");
        }
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Long userId, String username, String role) {
        return buildToken(userId, username, role, "access", accessTokenExpiration);
    }

    public String generateRefreshToken(Long userId, String username) {
        return buildToken(userId, username, null, "refresh", refreshTokenExpiration);
    }

    private String buildToken(Long userId, String username, String role, String type, Long expiration) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);

        JwtBuilder builder = Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("type", type)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSecretKey(), Jwts.SIG.HS256);

        if (role != null) {
            builder.claim("role", role);
        }

        return builder.compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT 已过期");
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            log.warn("JWT 无效: {}", e.getMessage());
        }
        return false;
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return Long.valueOf(claims.getSubject());
    }

    public String getRoleFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("role", String.class);
    }
}
