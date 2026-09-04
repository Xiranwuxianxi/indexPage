package com.xiran.platform.home.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xiran.platform.article.mapper.ArticleMapper;
import com.xiran.platform.article.service.ArticleService;
import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.nginx.mapper.ErrorSolutionMapper;
import com.xiran.platform.nginx.service.ErrorSolutionService;
import com.xiran.platform.project.mapper.ProjectMapper;
import com.xiran.platform.project.service.ProjectService;
import com.xiran.platform.tool.entity.Tool;
import com.xiran.platform.tool.mapper.ToolMapper;
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
    private final ToolMapper toolMapper;
    private final ArticleMapper articleMapper;
    private final ErrorSolutionMapper errorSolutionMapper;
    private final ProjectMapper projectMapper;

    @GetMapping
    @Operation(summary = "Home aggregate data")
    public ApiResponse<Map<String, Object>> home() {
        Map<String, Object> data = new HashMap<>();

        Map<String, Object> hero = new HashMap<>();
        hero.put("eyebrow", "XIRAN DEVELOPER PLATFORM");
        hero.put("title", "希燃呀");
        hero.put("subtitle", "面向开发者的在线工具、报错解决方案与工程实验平台");
        hero.put("description", "当你遇到 Nginx、Spring Boot、Vue、Docker 或 AI 工程化问题时，在这里搜索错误、使用工具、阅读解决方案，并把配置保存下来。");
        hero.put("primaryAction", Map.of("text", "使用在线工具", "href", "/tools"));
        hero.put("secondaryAction", Map.of("text", "搜索错误", "href", "/errors"));
        hero.put("tertiaryAction", Map.of("text", "浏览项目", "href", "/projects"));
        data.put("hero", hero);

        data.put("hotTools", toolService.listHot(6));
        data.put("commonErrors", errorSolutionService.list(1, 3).getRecords());
        data.put("featuredProjects", projectService.listFeatured(3));
        data.put("latestArticles", articleService.listLatest(3));

        // 站点使用数据（首页统计条）
        Map<String, Object> stats = new HashMap<>();
        stats.put("toolCount", countPublished(toolMapper));
        stats.put("articleCount", countPublished(articleMapper));
        stats.put("errorCount", countPublished(errorSolutionMapper));
        stats.put("projectCount", countPublished(projectMapper));
        stats.put("totalUsage", totalUsage());
        data.put("stats", stats);

        List<Map<String, Object>> focusAreas = List.of(
                Map.of("title", "Deployment & Server", "items", List.of("Nginx", "OpenResty", "Linux", "HTTPS", "Docker", "GitHub Actions")),
                Map.of("title", "Java Backend", "items", List.of("Spring Boot", "Spring Security", "JWT", "MyBatis Plus", "Redis", "MinIO")),
                Map.of("title", "Vue Frontend", "items", List.of("Vue 3", "Vite", "Vue Router", "Axios", "Performance", "SEO")),
                Map.of("title", "AI Engineering", "items", List.of("Spring AI", "LangChain4j", "MCP", "Agent", "RAG", "n8n"))
        );
        data.put("focusAreas", focusAreas);

        return ApiResponse.success(data);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private long countPublished(com.baomidou.mybatisplus.core.mapper.BaseMapper mapper) {
        com.baomidou.mybatisplus.core.conditions.query.QueryWrapper wrapper =
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper();
        wrapper.eq("status", 1);
        wrapper.eq("deleted", 0);
        Long count = (Long) mapper.selectCount(wrapper);
        return count == null ? 0L : count;
    }

    private long totalUsage() {
        LambdaQueryWrapper<Tool> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tool::getStatus, 1);
        wrapper.eq(Tool::getDeleted, 0);
        return toolMapper.selectList(wrapper).stream()
                .mapToLong(t -> t.getUsageCount() == null ? 0L : t.getUsageCount())
                .sum();
    }
}
