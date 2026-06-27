package com.xiran.platform.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * OAuth 账号关联表
 *
 * 支持 GitHub OAuth 登录，一个用户可绑定多个 OAuth 账号。
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("oauth_account")
public class OAuthAccount extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("provider")
    private String provider;

    @TableField("provider_user_id")
    private String providerUserId;

    @TableField("provider_username")
    private String providerUsername;

    @TableField("access_token")
    private String accessToken;

    @TableField("refresh_token")
    private String refreshToken;
}
