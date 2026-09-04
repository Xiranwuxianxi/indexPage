package com.xiran.platform.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 项目创建/编辑请求（管理后台）
 */
@Data
public class ProjectRequest {

    @NotBlank(message = "项目名称不能为空")
    @Size(max = 128, message = "项目名称最长 128 字符")
    private String name;

    @NotBlank(message = "URL 别名不能为空")
    @Size(max = 128, message = "URL 别名最长 128 字符")
    private String slug;

    @Size(max = 500, message = "项目简介最长 500 字符")
    private String summary;

    private String description;

    /**
     * 项目封面图 URL
     */
    @Size(max = 255, message = "封面图地址最长 255 字符")
    private String cover;

    /**
     * 类型（如：工具 / 文章 / 日记）
     */
    @Size(max = 32, message = "类型最长 32 字符")
    private String type;

    /**
     * 项目状态：online / active / offline / archived
     */
    @Size(max = 32, message = "项目状态最长 32 字符")
    private String projectStatus;

    /**
     * 项目网址（在线体验地址）
     */
    @Size(max = 255, message = "项目网址最长 255 字符")
    private String demoUrl;

    @Size(max = 255, message = "仓库地址最长 255 字符")
    private String repoUrl;

    /**
     * 技术栈，逗号分隔
     */
    @Size(max = 500, message = "技术栈最长 500 字符")
    private String techStack;

    @Size(max = 32, message = "图标最长 32 字符")
    private String icon;

    /**
     * 发布状态：1 发布，0 下线，2 草稿
     */
    private Integer status;
}
