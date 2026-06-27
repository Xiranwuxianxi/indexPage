package com.xiran.platform.search.controller;

import com.xiran.platform.article.dto.ArticleResponse;
import com.xiran.platform.article.service.ArticleService;
import com.xiran.platform.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Site-wide search")
public class SearchController {

    private final ArticleService articleService;

    @GetMapping
    @Operation(summary = "Search")
    public ApiResponse<List<ArticleResponse>> search(@RequestParam String q) {
        if (!StringUtils.hasText(q)) {
            return ApiResponse.success(Collections.emptyList());
        }
        return ApiResponse.success(articleService.searchByKeyword(q.trim()));
    }

    @GetMapping("/hot")
    @Operation(summary = "Hot searches")
    public ApiResponse<List<String>> hotSearches() {
        return ApiResponse.success(List.of("nginx 404", "Vue history mode", "Spring Boot CORS"));
    }
}
