package com.xiran.platform.tool.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.common.exception.BusinessException;
import com.xiran.platform.tool.dto.ToolRequest;
import com.xiran.platform.tool.dto.ToolResponse;
import com.xiran.platform.tool.entity.Tool;
import com.xiran.platform.tool.entity.ToolCategory;
import com.xiran.platform.tool.mapper.ToolCategoryMapper;
import com.xiran.platform.tool.mapper.ToolMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToolService {

    private final ToolMapper toolMapper;
    private final ToolCategoryMapper toolCategoryMapper;

    public Page<ToolResponse> list(int page, int size) {
        Page<Tool> entityPage = listEntities(page, size);
        List<ToolResponse> records = entityPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        Page<ToolResponse> responsePage = new Page<>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal());
        responsePage.setRecords(records);
        return responsePage;
    }

    public Page<Tool> listEntities(int page, int size) {
        LambdaQueryWrapper<Tool> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tool::getStatus, 1);
        wrapper.eq(Tool::getDeleted, 0);
        wrapper.orderByDesc(Tool::getUsageCount);
        return toolMapper.selectPage(new Page<>(page, size), wrapper);
    }

    public List<ToolResponse> listHot(int limit) {
        LambdaQueryWrapper<Tool> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tool::getStatus, 1);
        wrapper.eq(Tool::getDeleted, 0);
        wrapper.orderByDesc(Tool::getUsageCount);
        wrapper.last("LIMIT " + limit);
        return toolMapper.selectList(wrapper).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ToolResponse getBySlug(String slug) {
        LambdaQueryWrapper<Tool> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tool::getSlug, slug);
        wrapper.eq(Tool::getStatus, 1);
        wrapper.eq(Tool::getDeleted, 0);
        Tool tool = toolMapper.selectOne(wrapper);
        return tool == null ? null : convertToResponse(tool);
    }

    // ---------- 管理后台 ----------

    /**
     * 管理后台列表：包含草稿/下线等全部状态，按更新时间倒序。
     */
    public Page<ToolResponse> listAll(int page, int size) {
        LambdaQueryWrapper<Tool> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tool::getDeleted, 0);
        wrapper.orderByDesc(Tool::getUpdatedAt);
        Page<Tool> entityPage = toolMapper.selectPage(new Page<>(page, size), wrapper);
        List<ToolResponse> records = entityPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        Page<ToolResponse> responsePage = new Page<>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal());
        responsePage.setRecords(records);
        return responsePage;
    }

    public ToolResponse create(ToolRequest request) {
        ensureSlugAvailable(request.getSlug(), null);
        Tool tool = new Tool();
        applyRequest(tool, request);
        tool.setUsageCount(0L);
        toolMapper.insert(tool);
        return convertToResponse(tool);
    }

    public ToolResponse update(Long id, ToolRequest request) {
        Tool tool = toolMapper.selectById(id);
        if (tool == null || (tool.getDeleted() != null && tool.getDeleted() == 1)) {
            throw new BusinessException("工具不存在");
        }
        ensureSlugAvailable(request.getSlug(), id);
        applyRequest(tool, request);
        toolMapper.updateById(tool);
        return convertToResponse(tool);
    }

    public void delete(Long id) {
        Tool tool = toolMapper.selectById(id);
        if (tool == null) {
            throw new BusinessException("工具不存在");
        }
        toolMapper.deleteById(id);
    }

    private void applyRequest(Tool tool, ToolRequest request) {
        tool.setName(request.getName());
        tool.setSlug(request.getSlug());
        tool.setSummary(request.getSummary());
        tool.setDescription(request.getDescription());
        tool.setIcon(request.getIcon());
        tool.setStatus(request.getStatus() != null ? request.getStatus() : 2);
        tool.setCategoryId(resolveCategoryId(request.getCategory()));
    }

    private void ensureSlugAvailable(String slug, Long excludeId) {
        LambdaQueryWrapper<Tool> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tool::getSlug, slug);
        wrapper.eq(Tool::getDeleted, 0);
        if (excludeId != null) {
            wrapper.ne(Tool::getId, excludeId);
        }
        if (toolMapper.selectCount(wrapper) > 0) {
            throw new BusinessException("URL 别名已存在：" + slug);
        }
    }

    /**
     * 按分类名称解析分类 ID，不存在时自动创建。
     */
    private Long resolveCategoryId(String categoryName) {
        if (!StringUtils.hasText(categoryName)) {
            return null;
        }
        String name = categoryName.trim();
        LambdaQueryWrapper<ToolCategory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ToolCategory::getName, name);
        wrapper.eq(ToolCategory::getDeleted, 0);
        ToolCategory existing = toolCategoryMapper.selectOne(wrapper);
        if (existing != null) {
            return existing.getId();
        }
        ToolCategory category = new ToolCategory();
        category.setName(name);
        category.setSlug(name.toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + System.currentTimeMillis() % 100000);
        category.setStatus(1);
        toolCategoryMapper.insert(category);
        return category.getId();
    }

    public Map<String, Object> execute(String slug, Map<String, Object> payload) {
        // 记录真实使用次数
        Tool tool = toolMapper.selectOne(new LambdaQueryWrapper<Tool>().eq(Tool::getSlug, slug));
        if (tool != null) {
            tool.setUsageCount((tool.getUsageCount() == null ? 0 : tool.getUsageCount()) + 1);
            toolMapper.updateById(tool);
        }

        if ("sitemap-checker".equals(slug)) {
            return checkSitemap(payload);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("slug", slug);
        result.put("input", payload);
        result.put("output", "Tool execution placeholder. Implement per slug later.");
        result.put("success", true);
        return result;
    }

    /**
     * Sitemap 检查器：服务端抓取 sitemap.xml，校验可访问性与 URL 条目数。
     */
    private Map<String, Object> checkSitemap(Map<String, Object> payload) {
        Map<String, Object> result = new HashMap<>();
        result.put("slug", "sitemap-checker");
        String url = payload == null ? null : String.valueOf(payload.getOrDefault("url", "")).trim();
        if (url.isEmpty()) {
            result.put("success", false);
            result.put("output", "请输入 sitemap 地址，例如 https://example.com/sitemap.xml");
            return result;
        }
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                    .connectTimeout(java.time.Duration.ofSeconds(4))
                    .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                    .build();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(url))
                    .timeout(java.time.Duration.ofSeconds(8))
                    .GET()
                    .build();
            java.net.http.HttpResponse<String> response = client.send(request,
                    java.net.http.HttpResponse.BodyHandlers.ofString());
            String body = response.body() == null ? "" : response.body();
            int urlCount = body.split("<url>").length - 1;
            boolean looksXml = body.contains("<urlset") || body.contains("<sitemapindex");
            result.put("success", response.statusCode() == 200 && looksXml);
            result.put("output", "HTTP " + response.statusCode()
                    + "，内容类型: " + response.headers().firstValue("content-type").orElse("未知")
                    + "，URL 条目数: " + urlCount
                    + (looksXml ? "" : "，警告：内容不像合法的 sitemap XML"));
        } catch (Exception e) {
            result.put("success", false);
            result.put("output", "抓取失败：" + e.getMessage());
        }
        return result;
    }

    private ToolResponse convertToResponse(Tool tool) {
        ToolResponse response = new ToolResponse();
        response.setId(tool.getId());
        response.setSlug(tool.getSlug());
        response.setName(tool.getName());
        response.setCategory(getCategoryName(tool.getCategoryId()));
        response.setSummary(tool.getSummary());
        response.setDescription(tool.getDescription());
        response.setIcon(tool.getIcon());
        response.setUsageCount(tool.getUsageCount());
        response.setUpdatedAt(tool.getUpdatedAt());
        response.setHref("/tools/" + tool.getSlug());
        response.setTags(Collections.emptyList());
        response.setPublishStatus(tool.getStatus());
        return response;
    }

    private String getCategoryName(Long categoryId) {
        if (categoryId == null) {
            return "";
        }
        ToolCategory category = toolCategoryMapper.selectById(categoryId);
        return category == null ? "" : category.getName();
    }
}
