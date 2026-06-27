package com.xiran.platform.nginx.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Nginx 配置模板
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("nginx_template")
public class NginxTemplate extends BaseEntity {

    @TableField("name")
    private String name;

    @TableField("slug")
    private String slug;

    @TableField("description")
    private String description;

    @TableField("template_content")
    private String templateContent;

    @TableField("category")
    private String category;
}
