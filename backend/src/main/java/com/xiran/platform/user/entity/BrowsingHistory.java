package com.xiran.platform.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 浏览历史表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("browsing_history")
public class BrowsingHistory extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("target_type")
    private String targetType;

    @TableField("target_id")
    private Long targetId;

    @TableField("title")
    private String title;

    @TableField("url")
    private String url;
}
