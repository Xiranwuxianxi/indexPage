package com.xiran.platform.analytics.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 页面访问统计表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("page_view")
public class PageView extends BaseEntity {

    @TableField("url")
    private String url;

    @TableField("referrer")
    private String referrer;

    @TableField("user_agent")
    private String userAgent;

    @TableField("ip")
    private String ip;

    @TableField("user_id")
    private Long userId;

    @TableField("session_id")
    private String sessionId;
}
