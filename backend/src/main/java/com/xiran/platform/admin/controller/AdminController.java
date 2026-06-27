package com.xiran.platform.admin.controller;

import com.xiran.platform.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
@Tag(name = "管理后台", description = "后台管理接口")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

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
}
