package com.xiran.platform.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 收藏表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bookmark")
public class Bookmark extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("target_type")
    private String targetType;

    @TableField("target_id")
    private Long targetId;
}
