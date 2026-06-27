package com.xiran.platform.auth.dto;

import com.xiran.platform.user.dto.UserProfileResponse;
import lombok.Data;

/**
 * Token 响应
 *
 * 包含 accessToken、refreshToken 与当前用户信息，便于前端登录后直接渲染。
 */
@Data
public class TokenResponse {

    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private UserProfileResponse user;
}
