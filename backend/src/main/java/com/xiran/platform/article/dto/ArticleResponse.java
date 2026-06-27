package com.xiran.platform.article.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ArticleResponse {
    private Long id;
    private String slug;
    private String title;
    private String summary;
    private String cover;
    private String category;
    private List<String> tags;
    private String author;
    private LocalDateTime publishedAt;
    private LocalDateTime updatedAt;
    private Long viewCount;
    private String href;
    private String htmlContent;
}
