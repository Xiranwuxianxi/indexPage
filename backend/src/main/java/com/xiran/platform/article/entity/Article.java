package com.xiran.platform.article.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xiran.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 文章实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("article")
public class Article extends BaseEntity {

    @TableField("title")
    private String title;

    @TableField("slug")
    private String slug;

    @TableField("summary")
    private String summary;

    @TableField("markdown_content")
    private String markdownContent;

    @TableField("html_content")
    private String htmlContent;

    @TableField("cover")
    private String cover;

    @TableField("seo_title")
    private String seoTitle;

    @TableField("seo_description")
    private String seoDescription;

    @TableField("canonical_url")
    private String canonicalUrl;

    @TableField("published_at")
    private LocalDateTime publishedAt;

    @TableField("view_count")
    private Long viewCount;

    @TableField("author_id")
    private Long authorId;

    @TableField("category_id")
    private Long categoryId;
}
