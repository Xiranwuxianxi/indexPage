package com.xiran.platform.tool.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.tool.dto.ToolResponse;
import com.xiran.platform.tool.service.ToolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tools")
@RequiredArgsConstructor
@Tag(name = "Tool", description = "Online tool related APIs")
public class ToolController {

    private final ToolService toolService;

    @GetMapping
    @Operation(summary = "Tool list")
    public ApiResponse<Page<ToolResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(toolService.list(page, size));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Tool detail")
    public ApiResponse<ToolResponse> detail(@PathVariable String slug) {
        return ApiResponse.success(toolService.getBySlug(slug));
    }

    @PostMapping("/{slug}/exec")
    @Operation(summary = "Execute tool")
    public ApiResponse<Map<String, Object>> execute(@PathVariable String slug,
                                                     @RequestBody Map<String, Object> payload) {
        return ApiResponse.success(toolService.execute(slug, payload));
    }
}
