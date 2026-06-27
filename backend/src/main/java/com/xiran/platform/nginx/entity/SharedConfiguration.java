package com.xiran.platform.nginx.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 分享的配置
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("shared_configuration")
public class SharedConfiguration extends BaseEntity {

    @TableField("saved_config_id")
    private Long savedConfigId;

    @TableField("share_code")
    private String shareCode;

    @TableField("expire_at")
    private java.time.LocalDateTime expireAt;

    @TableField("view_count")
    private Long viewCount;
}
