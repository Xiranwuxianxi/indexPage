package com.xiran.platform.article.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 文章-标签关联表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("article_tag")
public class ArticleTag extends BaseEntity {

    @TableField("article_id")
    private Long articleId;

    @TableField("tag_id")
    private Long tagId;
}
