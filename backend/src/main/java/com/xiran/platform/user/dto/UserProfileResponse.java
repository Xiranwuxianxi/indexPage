package com.xiran.platform.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 当前用户信息响应
 *
 * 字段与前端 user store 对齐。
 */
@Data
public class UserProfileResponse {

    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String avatar;
    private String bio;
    private String role;
    private Boolean subscribed;
    private String github;
    private LocalDateTime createdAt;
}
