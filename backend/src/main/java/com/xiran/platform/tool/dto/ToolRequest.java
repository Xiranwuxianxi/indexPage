package com.xiran.platform.tool.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 工具创建/编辑请求（管理后台）
 */
@Data
public class ToolRequest {

    @NotBlank(message = "工具名称不能为空")
    @Size(max = 128, message = "工具名称最长 128 字符")
    private String name;

    @NotBlank(message = "URL 别名不能为空")
    @Size(max = 128, message = "URL 别名最长 128 字符")
    private String slug;

    @Size(max = 500, message = "简介最长 500 字符")
    private String summary;

    private String description;

    /**
     * 分类名称（如：部署 / 后端 / 安全 / SEO），不存在时自动创建
     */
    @Size(max = 64, message = "分类名称最长 64 字符")
    private String category;

    @Size(max = 32, message = "图标最长 32 字符")
    private String icon;

    /**
     * 状态：1 发布，0 下线，2 草稿
     */
    private Integer status;
}
