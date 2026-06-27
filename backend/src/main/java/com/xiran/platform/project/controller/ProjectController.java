package com.xiran.platform.project.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.project.dto.ProjectResponse;
import com.xiran.platform.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Open source and experiment project APIs")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Project list")
    public ApiResponse<Page<ProjectResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(projectService.list(page, size));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Project detail")
    public ApiResponse<ProjectResponse> detail(@PathVariable String slug) {
        return ApiResponse.success(projectService.getBySlug(slug));
    }
}
