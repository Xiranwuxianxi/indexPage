package com.xiran.platform.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user")
public class User extends BaseEntity {

    /**
     * 用户名，用于登录
     */
    @TableField("username")
    private String username;

    /**
     * 邮箱，用于登录与通知
     */
    @TableField("email")
    private String email;

    /**
     * BCrypt 加密后的密码
     */
    @TableField("password")
    private String password;

    /**
     * 昵称
     */
    @TableField("nickname")
    private String nickname;

    /**
     * 头像 URL
     */
    @TableField("avatar")
    private String avatar;

    /**
     * 个人简介
     */
    @TableField("bio")
    private String bio;

    /**
     * 角色：USER / EDITOR / ADMIN
     * 第一阶段使用单角色字符串，后续可扩展为 user_role 多对多关系
     */
    @TableField("role")
    private String role;

    /**
     * GitHub 用户 ID
     */
    @TableField("github_id")
    private String githubId;

    /**
     * 是否订阅更新通知
     */
    @TableField("subscribed")
    private Boolean subscribed;
}
