package com.xiran.platform.nginx.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.nginx.dto.ErrorSolutionResponse;
import com.xiran.platform.nginx.service.ErrorSolutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/errors")
@RequiredArgsConstructor
@Tag(name = "Error Solution", description = "Development error solutions")
public class ErrorSolutionController {

    private final ErrorSolutionService errorSolutionService;

    @GetMapping
    @Operation(summary = "Error list")
    public ApiResponse<Page<ErrorSolutionResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(errorSolutionService.list(page, size));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Error detail")
    public ApiResponse<ErrorSolutionResponse> detail(@PathVariable String slug) {
        return ApiResponse.success(errorSolutionService.getBySlug(slug));
    }
}
