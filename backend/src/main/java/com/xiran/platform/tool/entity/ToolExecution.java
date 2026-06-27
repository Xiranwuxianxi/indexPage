package com.xiran.platform.tool.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 工具执行记录
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tool_execution")
public class ToolExecution extends BaseEntity {

    @TableField("tool_id")
    private Long toolId;

    @TableField("user_id")
    private Long userId;

    @TableField("input")
    private String input;

    @TableField("started_at")
    private LocalDateTime startedAt;

    @TableField("finished_at")
    private LocalDateTime finishedAt;

    @TableField("success")
    private Boolean success;

    @TableField("error_message")
    private String errorMessage;
}
