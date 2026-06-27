package com.xiran.platform.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户反馈表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("feedback")
public class Feedback extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("type")
    private String type;

    @TableField("content")
    private String content;

    @TableField("contact")
    private String contact;
}
