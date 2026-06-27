package com.xiran.platform.nginx.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Nginx 检查规则
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("nginx_rule")
public class NginxRule extends BaseEntity {

    @TableField("code")
    private String code;

    @TableField("level")
    private String level;

    @TableField("title")
    private String title;

    @TableField("description")
    private String description;

    @TableField("suggestion")
    private String suggestion;

    @TableField("example_before")
    private String exampleBefore;

    @TableField("example_after")
    private String exampleAfter;

    @TableField("tutorial_url")
    private String tutorialUrl;
}
