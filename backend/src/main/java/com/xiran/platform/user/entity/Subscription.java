package com.xiran.platform.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 订阅表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("subscription")
public class Subscription extends BaseEntity {

    @TableField("email")
    private String email;

    @TableField("user_id")
    private Long userId;

    @TableField("type")
    private String type;
}
