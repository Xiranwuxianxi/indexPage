package com.xiran.platform.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 搜索历史表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("search_history")
public class SearchHistory extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("keyword")
    private String keyword;

    @TableField("has_result")
    private Boolean hasResult;
}
