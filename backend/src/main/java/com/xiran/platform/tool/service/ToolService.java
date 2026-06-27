package com.xiran.platform.tool.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.tool.dto.ToolResponse;
import com.xiran.platform.tool.entity.Tool;
import com.xiran.platform.tool.entity.ToolCategory;
import com.xiran.platform.tool.mapper.ToolCategoryMapper;
import com.xiran.platform.tool.mapper.ToolMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public Map<String, Object> execute(String slug, Map<String, Object> payload) {
        Map<String, Object> result = new HashMap<>();
        result.put("slug", slug);
        result.put("input", payload);
        result.put("output", "Tool execution placeholder. Implement per slug later.");
        result.put("success", true);
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
