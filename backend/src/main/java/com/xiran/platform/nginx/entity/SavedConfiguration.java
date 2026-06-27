package com.xiran.platform.nginx.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户保存的 Nginx 配置
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("saved_configuration")
public class SavedConfiguration extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("name")
    private String name;

    @TableField("tool_slug")
    private String toolSlug;

    @TableField("config_content")
    private String configContent;

    @TableField("parameters")
    private String parameters;
}
