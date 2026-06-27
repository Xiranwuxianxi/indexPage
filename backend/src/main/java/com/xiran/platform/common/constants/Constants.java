package com.xiran.platform.common.constants;

/**
 * 业务常量
 */
public class Constants {

    /**
     * API 前缀
     */
    public static final String API_PREFIX = "/api/v1";

    /**
     * JWT Token 请求头
     */
    public static final String TOKEN_HEADER = "Authorization";

    /**
     * JWT Token 前缀
     */
    public static final String TOKEN_PREFIX = "Bearer ";

    /**
     * 用户角色
     */
    public static final String ROLE_USER = "USER";
    public static final String ROLE_EDITOR = "EDITOR";
    public static final String ROLE_ADMIN = "ADMIN";

    /**
     * 默认分页参数
     */
    public static final int DEFAULT_PAGE = 1;
    public static final int DEFAULT_SIZE = 10;

    private Constants() {
    }
}
