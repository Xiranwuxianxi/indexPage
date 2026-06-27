package com.xiran.platform.article.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.article.dto.ArticleResponse;
import com.xiran.platform.article.entity.Article;
import com.xiran.platform.article.entity.ArticleTag;
import com.xiran.platform.article.entity.Category;
import com.xiran.platform.article.entity.Tag;
import com.xiran.platform.article.mapper.ArticleMapper;
import com.xiran.platform.article.mapper.ArticleTagMapper;
import com.xiran.platform.article.mapper.CategoryMapper;
import com.xiran.platform.article.mapper.TagMapper;
import com.xiran.platform.user.entity.User;
import com.xiran.platform.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final ArticleTagMapper articleTagMapper;
    private final UserMapper userMapper;

    public Page<ArticleResponse> listPublished(int page, int size) {
        Page<Article> entityPage = listPublishedEntities(page, size);
        List<ArticleResponse> records = entityPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        Page<ArticleResponse> responsePage = new Page<>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal());
        responsePage.setRecords(records);
        return responsePage;
    }

    public Page<Article> listPublishedEntities(int page, int size) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, 1);
        wrapper.eq(Article::getDeleted, 0);
        wrapper.orderByDesc(Article::getPublishedAt);
        return articleMapper.selectPage(new Page<>(page, size), wrapper);
    }

    public List<ArticleResponse> listLatest(int limit) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, 1);
        wrapper.eq(Article::getDeleted, 0);
        wrapper.orderByDesc(Article::getPublishedAt);
        wrapper.last("LIMIT " + limit);
        return articleMapper.selectList(wrapper).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ArticleResponse getBySlug(String slug) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getSlug, slug);
        wrapper.eq(Article::getStatus, 1);
        wrapper.eq(Article::getDeleted, 0);
        Article article = articleMapper.selectOne(wrapper);
        return article == null ? null : convertToResponse(article);
    }

    public List<ArticleResponse> searchByKeyword(String keyword) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, 1);
        wrapper.eq(Article::getDeleted, 0);
        wrapper.and(w -> w.like(Article::getTitle, keyword)
                .or()
                .like(Article::getSummary, keyword));
        return articleMapper.selectList(wrapper).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private ArticleResponse convertToResponse(Article article) {
        ArticleResponse response = new ArticleResponse();
        response.setId(article.getId());
        response.setSlug(article.getSlug());
        response.setTitle(article.getTitle());
        response.setSummary(article.getSummary());
        response.setCover(article.getCover());
        response.setCategory(getCategoryName(article.getCategoryId()));
        response.setTags(getArticleTags(article.getId()));
        response.setAuthor(getAuthorName(article.getAuthorId()));
        response.setPublishedAt(article.getPublishedAt());
        response.setUpdatedAt(article.getUpdatedAt());
        response.setViewCount(article.getViewCount());
        response.setHref("/articles/" + article.getSlug());
        response.setHtmlContent(article.getHtmlContent());
        return response;
    }

    private String getCategoryName(Long categoryId) {
        if (categoryId == null) {
            return "";
        }
        Category category = categoryMapper.selectById(categoryId);
        return category == null ? "" : category.getName();
    }

    private List<String> getArticleTags(Long articleId) {
        LambdaQueryWrapper<ArticleTag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticleTag::getArticleId, articleId);
        wrapper.eq(ArticleTag::getDeleted, 0);
        List<ArticleTag> articleTags = articleTagMapper.selectList(wrapper);
        if (CollectionUtils.isEmpty(articleTags)) {
            return Collections.emptyList();
        }
        Set<Long> tagIds = articleTags.stream()
                .map(ArticleTag::getTagId)
                .collect(Collectors.toSet());
        List<Tag> tags = tagMapper.selectBatchIds(tagIds);
        return tags.stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
    }

    private String getAuthorName(Long authorId) {
        if (authorId == null) {
            return "Xiran";
        }
        User user = userMapper.selectById(authorId);
        return user == null ? "Xiran" : (user.getNickname() != null ? user.getNickname() : user.getUsername());
    }
}
