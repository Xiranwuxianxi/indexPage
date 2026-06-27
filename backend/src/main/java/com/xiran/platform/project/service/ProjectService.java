package com.xiran.platform.project.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.project.dto.ProjectResponse;
import com.xiran.platform.project.entity.Project;
import com.xiran.platform.project.entity.ProjectTag;
import com.xiran.platform.project.mapper.ProjectMapper;
import com.xiran.platform.project.mapper.ProjectTagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectMapper projectMapper;
    private final ProjectTagMapper projectTagMapper;

    public Page<ProjectResponse> list(int page, int size) {
        Page<Project> entityPage = listEntities(page, size);
        List<ProjectResponse> records = entityPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        Page<ProjectResponse> responsePage = new Page<>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal());
        responsePage.setRecords(records);
        return responsePage;
    }

    public Page<Project> listEntities(int page, int size) {
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Project::getStatus, 1);
        wrapper.eq(Project::getDeleted, 0);
        wrapper.orderByDesc(Project::getUpdatedAt);
        return projectMapper.selectPage(new Page<>(page, size), wrapper);
    }

    public List<ProjectResponse> listFeatured(int limit) {
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Project::getStatus, 1);
        wrapper.eq(Project::getDeleted, 0);
        wrapper.orderByDesc(Project::getUpdatedAt);
        wrapper.last("LIMIT " + limit);
        return projectMapper.selectList(wrapper).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getBySlug(String slug) {
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Project::getSlug, slug);
        wrapper.eq(Project::getStatus, 1);
        wrapper.eq(Project::getDeleted, 0);
        Project project = projectMapper.selectOne(wrapper);
        return project == null ? null : convertToResponse(project);
    }

    private ProjectResponse convertToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setSlug(project.getSlug());
        response.setName(project.getName());
        response.setHref(StringUtils.hasText(project.getDemoUrl()) ? project.getDemoUrl() : "/projects/" + project.getSlug());
        response.setDemoUrl(project.getDemoUrl());
        response.setRepoUrl(project.getRepoUrl());
        response.setType(project.getType());
        response.setStatus(project.getProjectStatus());
        response.setStatusText(getStatusText(project.getProjectStatus()));
        response.setIcon(project.getIcon());
        response.setTags(getProjectTags(project.getId()));
        response.setSummary(project.getSummary());
        response.setDescription(project.getDescription());
        response.setCover(project.getCover());
        response.setTechStack(parseTechStack(project.getTechStack()));
        response.setUpdatedAt(project.getUpdatedAt());
        return response;
    }

    private String getStatusText(String status) {
        return switch (status) {
            case "online" -> "Running";
            case "active" -> "Active";
            case "offline" -> "Offline";
            case "archived" -> "Archived";
            default -> status;
        };
    }

    private List<String> parseTechStack(String techStack) {
        if (!StringUtils.hasText(techStack)) {
            return Collections.emptyList();
        }
        return Arrays.stream(techStack.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .collect(Collectors.toList());
    }

    private List<String> getProjectTags(Long projectId) {
        LambdaQueryWrapper<ProjectTag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProjectTag::getProjectId, projectId);
        wrapper.eq(ProjectTag::getDeleted, 0);
        List<ProjectTag> projectTags = projectTagMapper.selectList(wrapper);
        if (CollectionUtils.isEmpty(projectTags)) {
            return Collections.emptyList();
        }
        return projectTags.stream()
                .map(pt -> String.valueOf(pt.getTagId()))
                .collect(Collectors.toList());
    }
}
