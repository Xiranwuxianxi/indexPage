package com.xiran.platform.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.project.dto.ProjectRequest;
import com.xiran.platform.project.dto.ProjectResponse;
import com.xiran.platform.project.service.ProjectService;
import com.xiran.platform.tool.dto.ToolRequest;
import com.xiran.platform.tool.dto.ToolResponse;
import com.xiran.platform.tool.service.ToolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理后台接口
 *
 * 所有接口要求 ADMIN 或 EDITOR 角色。
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "管理后台", description = "后台管理接口")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final ToolService toolService;
    private final ProjectService projectService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "仪表盘数据")
    public ApiResponse<Map<String, Object>> dashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("todayUv", 0);
        data.put("todayPv", 0);
        data.put("hotTools", java.util.Collections.emptyList());
        data.put("hotArticles", java.util.Collections.emptyList());
        return ApiResponse.success(data);
    }

    @GetMapping("/stats/tools")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "工具执行统计")
    public ApiResponse<Map<String, Object>> toolStats() {
        Map<String, Object> data = new HashMap<>();
        data.put("successRate", 0);
        data.put("failureRate", 0);
        return ApiResponse.success(data);
    }

    // ---------- 工具管理 ----------

    @GetMapping("/tools")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "工具列表（含草稿/下线）")
    public ApiResponse<Page<ToolResponse>> listTools(@RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.success(toolService.listAll(page, size));
    }

    @PostMapping("/tools")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "发布新工具")
    public ApiResponse<ToolResponse> createTool(@Valid @RequestBody ToolRequest request) {
        return ApiResponse.success(toolService.create(request));
    }

    @PutMapping("/tools/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "编辑工具")
    public ApiResponse<ToolResponse> updateTool(@PathVariable Long id,
                                                @Valid @RequestBody ToolRequest request) {
        return ApiResponse.success(toolService.update(id, request));
    }

    @DeleteMapping("/tools/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "删除工具")
    public ApiResponse<Void> deleteTool(@PathVariable Long id) {
        toolService.delete(id);
        return ApiResponse.success(null);
    }

    // ---------- 项目管理 ----------

    @GetMapping("/projects")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "项目列表（含草稿/下线）")
    public ApiResponse<Page<ProjectResponse>> listProjects(@RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.success(projectService.listAll(page, size));
    }

    @PostMapping("/projects")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "新增项目")
    public ApiResponse<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        return ApiResponse.success(projectService.create(request));
    }

    @PutMapping("/projects/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "编辑项目")
    public ApiResponse<ProjectResponse> updateProject(@PathVariable Long id,
                                                      @Valid @RequestBody ProjectRequest request) {
        return ApiResponse.success(projectService.update(id, request));
    }

    @DeleteMapping("/projects/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "删除项目")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        projectService.delete(id);
        return ApiResponse.success(null);
    }
}
