package com.xiran.platform.nginx.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 错误知识库条目
 *
 * 实际业务中可归入 nginx 模块或单独 error 模块，第一阶段先放在 nginx 模块下。
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("error_solution")
public class ErrorSolution extends BaseEntity {

    @TableField("original_text")
    private String originalText;

    @TableField("slug")
    private String slug;

    @TableField("title")
    private String title;

    @TableField("category")
    private String category;

    @TableField("summary")
    private String summary;

    @TableField("cause")
    private String cause;

    @TableField("scenario")
    private String scenario;

    @TableField("wrong_example")
    private String wrongExample;

    @TableField("correct_example")
    private String correctExample;

    @TableField("solution")
    private String solution;

    @TableField("verify_command")
    private String verifyCommand;

    @TableField("misunderstanding")
    private String misunderstanding;

    @TableField("related_tool_ids")
    private String relatedToolIds;

    @TableField("related_article_ids")
    private String relatedArticleIds;
}
