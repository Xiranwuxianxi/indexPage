package com.xiran.platform.project.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectResponse {
    private Long id;
    private String slug;
    private String name;
    private String href;
    private String demoUrl;
    private String repoUrl;
    private String type;
    private String status;
    private String statusText;
    private String icon;
    private List<String> tags;
    private String summary;
    private String description;
    private String cover;
    private List<String> techStack;
    private LocalDateTime updatedAt;

    /** 发布状态：1 发布，0 下线，2 草稿（管理后台编辑用） */
    private Integer publishStatus;
}
