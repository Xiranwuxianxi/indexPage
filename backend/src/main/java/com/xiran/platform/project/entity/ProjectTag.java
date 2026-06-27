package com.xiran.platform.project.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 项目-标签关联表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("project_tag")
public class ProjectTag extends BaseEntity {

    @TableField("project_id")
    private Long projectId;

    @TableField("tag_id")
    private Long tagId;
}
