package com.xiran.platform.tutorial.controller;

import com.xiran.platform.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tutorials")
@Tag(name = "Tutorial", description = "System tutorial categories")
public class TutorialController {

    @GetMapping
    @Operation(summary = "Tutorial category list")
    public ApiResponse<List<Map<String, Object>>> categories() {
        return ApiResponse.success(List.of(
                Map.of("id", "deployment", "name", "Deployment & Server", "slug", "deployment", "count", 12),
                Map.of("id", "java", "name", "Java Backend", "slug", "java", "count", 8),
                Map.of("id", "frontend", "name", "Vue Frontend", "slug", "frontend", "count", 10),
                Map.of("id", "ai", "name", "AI Engineering", "slug", "ai", "count", 6),
                Map.of("id", "server", "name", "Linux & DevOps", "slug", "server", "count", 9)
        ));
    }
}
