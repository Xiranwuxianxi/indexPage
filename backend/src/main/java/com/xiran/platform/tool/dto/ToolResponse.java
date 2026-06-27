package com.xiran.platform.tool.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ToolResponse {
    private Long id;
    private String slug;
    private String name;
    private String category;
    private String summary;
    private String description;
    private String icon;
    private Long usageCount;
    private LocalDateTime updatedAt;
    private String href;
    private List<String> tags;
}
