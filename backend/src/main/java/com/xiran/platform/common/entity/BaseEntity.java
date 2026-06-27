package com.xiran.platform.common.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 实体基类
 *
 * 所有业务表公共字段：主键、创建时间、更新时间、软删除、状态、排序。
 */
@Data
public abstract class BaseEntity {

    /**
     * 主键，使用数据库自增 ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 创建时间，自动填充
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间，自动填充
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 软删除标记：0 未删除，1 已删除
     */
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;

    /**
     * 状态：0 禁用，1 启用，2 草稿
     */
    @TableField(fill = FieldFill.INSERT)
    private Integer status;

    /**
     * 排序权重，数值越小越靠前
     */
    @TableField(fill = FieldFill.INSERT)
    private Integer sortOrder;
}
