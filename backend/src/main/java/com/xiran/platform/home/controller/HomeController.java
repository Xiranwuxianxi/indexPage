package com.xiran.platform.home.controller;

import com.xiran.platform.article.service.ArticleService;
import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.nginx.service.ErrorSolutionService;
import com.xiran.platform.project.service.ProjectService;
import com.xiran.platform.tool.service.ToolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
@Tag(name = "Home", description = "Home aggregate data")
public class HomeController {

    private final ToolService toolService;
    private final ArticleService articleService;
    private final ProjectService projectService;
    private final ErrorSolutionService errorSolutionService;

    @GetMapping
    @Operation(summary = "Home aggregate data")
    public ApiResponse<Map<String, Object>> home() {
        Map<String, Object> data = new HashMap<>();

        Map<String, Object> hero = new HashMap<>();
        hero.put("eyebrow", "XIRAN DEVELOPER PLATFORM");
        hero.put("title", "Xiran");
        hero.put("subtitle", "Online tools, error solutions and engineering experiments for developers");
        hero.put("description", "When you encounter Nginx, Spring Boot, Vue, Docker or AI engineering issues, search errors, use tools, read solutions and save configurations here.");
        hero.put("primaryAction", Map.of("text", "Use Tools", "href", "/tools"));
        hero.put("secondaryAction", Map.of("text", "Search Errors", "href", "/errors"));
        hero.put("tertiaryAction", Map.of("text", "Browse Projects", "href", "/projects"));
        data.put("hero", hero);

        data.put("hotTools", toolService.listHot(6));
        data.put("commonErrors", errorSolutionService.list(1, 3).getRecords());
        data.put("featuredProjects", projectService.listFeatured(3));
        data.put("latestArticles", articleService.listLatest(3));

        List<Map<String, Object>> focusAreas = List.of(
                Map.of("title", "Deployment & Server", "items", List.of("Nginx", "OpenResty", "Linux", "HTTPS", "Docker", "GitHub Actions")),
                Map.of("title", "Java Backend", "items", List.of("Spring Boot", "Spring Security", "JWT", "MyBatis Plus", "Redis", "MinIO")),
                Map.of("title", "Vue Frontend", "items", List.of("Vue 3", "Vite", "Vue Router", "Axios", "Performance", "SEO")),
                Map.of("title", "AI Engineering", "items", List.of("Spring AI", "LangChain4j", "MCP", "Agent", "RAG", "n8n"))
        );
        data.put("focusAreas", focusAreas);

        return ApiResponse.success(data);
    }
}
