package com.xiran.platform.tool.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 工具实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tool")
public class Tool extends BaseEntity {

    @TableField("name")
    private String name;

    @TableField("slug")
    private String slug;

    @TableField("summary")
    private String summary;

    @TableField("description")
    private String description;

    @TableField("category_id")
    private Long categoryId;

    @TableField("icon")
    private String icon;

    @TableField("usage_count")
    private Long usageCount;
}
