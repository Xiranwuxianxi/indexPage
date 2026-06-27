package com.xiran.platform.article.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.article.dto.ArticleResponse;
import com.xiran.platform.article.service.ArticleService;
import com.xiran.platform.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@Tag(name = "Article", description = "Technical article related APIs")
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    @Operation(summary = "Article list")
    public ApiResponse<Page<ArticleResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(articleService.listPublished(page, size));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Article detail")
    public ApiResponse<ArticleResponse> detail(@PathVariable String slug) {
        return ApiResponse.success(articleService.getBySlug(slug));
    }
}
