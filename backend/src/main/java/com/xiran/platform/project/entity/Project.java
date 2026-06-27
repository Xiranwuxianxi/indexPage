package com.xiran.platform.project.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 项目实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("project")
public class Project extends BaseEntity {

    @TableField("name")
    private String name;

    @TableField("slug")
    private String slug;

    @TableField("summary")
    private String summary;

    @TableField("description")
    private String description;

    @TableField("cover")
    private String cover;

    @TableField("type")
    private String type;

    @TableField("project_status")
    private String projectStatus;

    @TableField("demo_url")
    private String demoUrl;

    @TableField("repo_url")
    private String repoUrl;

    @TableField("tech_stack")
    private String techStack;

    @TableField("icon")
    private String icon;
}
