package com.xiran.platform.analytics.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

/**
 * 每日统计表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("daily_stat")
public class DailyStat extends BaseEntity {

    @TableField("stat_date")
    private LocalDate statDate;

    @TableField("uv")
    private Long uv;

    @TableField("pv")
    private Long pv;

    @TableField("new_users")
    private Long newUsers;

    @TableField("tool_executions")
    private Long toolExecutions;

    @TableField("tool_failures")
    private Long toolFailures;

    @TableField("searches")
    private Long searches;

    @TableField("searches_without_result")
    private Long searchesWithoutResult;
}
