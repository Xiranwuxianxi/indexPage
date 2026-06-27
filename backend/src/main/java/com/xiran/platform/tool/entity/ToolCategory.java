package com.xiran.platform.tool.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 工具分类实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tool_category")
public class ToolCategory extends BaseEntity {

    @TableField("name")
    private String name;

    @TableField("slug")
    private String slug;

    @TableField("description")
    private String description;
}
