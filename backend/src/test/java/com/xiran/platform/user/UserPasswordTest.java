package com.xiran.platform.user;

import com.xiran.platform.user.entity.User;
import com.xiran.platform.user.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * 用户服务与密码加密测试
 */
@SpringBootTest
@ActiveProfiles("test")
class UserPasswordTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void passwordShouldBeEncryptedWithBCrypt() {
        String rawPassword = "xiran123";
        String encoded = passwordEncoder.encode(rawPassword);
        assertTrue(encoded.startsWith("$2a$"));
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
    }
}
