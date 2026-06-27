package com.xiran.platform.user.controller;

import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.common.security.JwtUtil;
import com.xiran.platform.user.dto.UserProfileResponse;
import com.xiran.platform.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

import static com.xiran.platform.common.constants.Constants.TOKEN_PREFIX;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "User center related APIs")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    @Operation(summary = "Get current user info", security = @SecurityRequirement(name = "bearerAuth"))
    public ApiResponse<UserProfileResponse> getMe(HttpServletRequest request) {
        String token = extractToken(request);
        return ApiResponse.success(userService.getProfile(token));
    }

    @GetMapping("/bookmarks")
    @Operation(summary = "My bookmarks", security = @SecurityRequirement(name = "bearerAuth"))
    public ApiResponse<List<Object>> bookmarks() {
        return ApiResponse.success(Collections.emptyList());
    }

    @GetMapping("/history")
    @Operation(summary = "Browsing history", security = @SecurityRequirement(name = "bearerAuth"))
    public ApiResponse<List<Object>> history() {
        return ApiResponse.success(Collections.emptyList());
    }

    @GetMapping("/saved-configs")
    @Operation(summary = "Saved configurations", security = @SecurityRequirement(name = "bearerAuth"))
    public ApiResponse<List<Object>> savedConfigs() {
        return ApiResponse.success(Collections.emptyList());
    }

    private String extractToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith(TOKEN_PREFIX)) {
            return bearer.substring(TOKEN_PREFIX.length());
        }
        return null;
    }
}
