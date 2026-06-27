package com.xiran.platform;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * 希燃呀开发者平台后端启动类
 *
 * - @EnableCaching: 启用 Spring Cache，结合 Redis 做接口与热点数据缓存
 * - @EnableJpaAuditing: 启用 JPA 审计（createdAt/updatedAt 自动填充）
 * - @MapperScan: 扫描 MyBatis Plus Mapper 接口
 */
@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
@MapperScan("com.xiran.platform.**.mapper")
public class XiranPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(XiranPlatformApplication.class, args);
    }
}
