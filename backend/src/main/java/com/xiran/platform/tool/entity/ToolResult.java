package com.xiran.platform.tool.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 工具执行结果
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tool_result")
public class ToolResult extends BaseEntity {

    @TableField("execution_id")
    private Long executionId;

    @TableField("output")
    private String output;

    @TableField("output_type")
    private String outputType;
}
