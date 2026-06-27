package com.xiran.platform.common.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xiran.platform.user.entity.User;
import com.xiran.platform.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 数据初始化器
 *
 * 应用启动时检查是否存在用户，若不存在则创建默认管理员账号。
 * 避免在 SQL 中写死无法校验的 BCrypt 密码。
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        long count = userMapper.selectCount(new LambdaQueryWrapper<User>());
        if (count == 0) {
            User admin = new User();
            admin.setUsername("xiran");
            admin.setEmail("hello@xiranya.cn");
            admin.setPassword(passwordEncoder.encode("xiran123"));
            admin.setNickname("希燃呀");
            admin.setAvatar("/avatar.png");
            admin.setBio("探索底层逻辑，用代码重构世界。");
            admin.setRole("ADMIN");
            admin.setSubscribed(true);
            userMapper.insert(admin);

            User demo = new User();
            demo.setUsername("demo");
            demo.setEmail("demo@xiranya.cn");
            demo.setPassword(passwordEncoder.encode("xiran123"));
            demo.setNickname("演示用户");
            demo.setAvatar("/avatar.png");
            demo.setBio("普通用户账号");
            demo.setRole("USER");
            demo.setSubscribed(false);
            userMapper.insert(demo);

            log.info("默认管理员账号已创建：hello@xiranya.cn / xiran123");
        }
    }
}
