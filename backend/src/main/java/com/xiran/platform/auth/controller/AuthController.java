package com.xiran.platform.auth.controller;

import com.xiran.platform.auth.dto.LoginRequest;
import com.xiran.platform.auth.dto.TokenResponse;
import com.xiran.platform.auth.service.AuthService;
import com.xiran.platform.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证接口
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "认证", description = "登录、刷新 Token、退出登录")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "邮箱密码登录")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/github")
    @Operation(summary = "GitHub OAuth 登录（Phase 4 实现）")
    public ApiResponse<TokenResponse> githubLogin() {
        return ApiResponse.error(501, "GitHub OAuth 登录暂未实现");
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新 Token（Phase 4 实现）")
    public ApiResponse<TokenResponse> refresh() {
        return ApiResponse.error(501, "刷新 Token 暂未实现");
    }

    @PostMapping("/logout")
    @Operation(summary = "退出登录（Phase 4 实现黑名单）")
    public ApiResponse<Void> logout() {
        return ApiResponse.success();
    }
}
