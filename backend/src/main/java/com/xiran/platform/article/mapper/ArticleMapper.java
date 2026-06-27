package com.xiran.platform.article.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiran.platform.article.entity.Article;
import org.apache.ibatis.annotations.Mapper;

/**
 * 文章 Mapper
 */
@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
}
