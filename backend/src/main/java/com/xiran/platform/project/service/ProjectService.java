package com.xiran.platform.project.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.common.exception.BusinessException;
import com.xiran.platform.project.dto.ProjectRequest;
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

    // ---------- 管理后台 ----------

    /**
     * 管理后台列表：包含草稿/下线等全部状态，按更新时间倒序。
     */
    public Page<ProjectResponse> listAll(int page, int size) {
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Project::getDeleted, 0);
        wrapper.orderByDesc(Project::getUpdatedAt);
        Page<Project> entityPage = projectMapper.selectPage(new Page<>(page, size), wrapper);
        List<ProjectResponse> records = entityPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        Page<ProjectResponse> responsePage = new Page<>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal());
        responsePage.setRecords(records);
        return responsePage;
    }

    public ProjectResponse create(ProjectRequest request) {
        ensureSlugAvailable(request.getSlug(), null);
        Project project = new Project();
        applyRequest(project, request);
        projectMapper.insert(project);
        return convertToResponse(project);
    }

    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = projectMapper.selectById(id);
        if (project == null || (project.getDeleted() != null && project.getDeleted() == 1)) {
            throw new BusinessException("项目不存在");
        }
        ensureSlugAvailable(request.getSlug(), id);
        applyRequest(project, request);
        projectMapper.updateById(project);
        return convertToResponse(project);
    }

    public void delete(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException("项目不存在");
        }
        projectMapper.deleteById(id);
    }

    private void applyRequest(Project project, ProjectRequest request) {
        project.setName(request.getName());
        project.setSlug(request.getSlug());
        project.setSummary(request.getSummary());
        project.setDescription(request.getDescription());
        project.setCover(request.getCover());
        project.setType(request.getType());
        project.setProjectStatus(StringUtils.hasText(request.getProjectStatus()) ? request.getProjectStatus() : "online");
        project.setDemoUrl(request.getDemoUrl());
        project.setRepoUrl(request.getRepoUrl());
        project.setTechStack(request.getTechStack());
        project.setIcon(request.getIcon());
        project.setStatus(request.getStatus() != null ? request.getStatus() : 1);
    }

    private void ensureSlugAvailable(String slug, Long excludeId) {
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Project::getSlug, slug);
        wrapper.eq(Project::getDeleted, 0);
        if (excludeId != null) {
            wrapper.ne(Project::getId, excludeId);
        }
        if (projectMapper.selectCount(wrapper) > 0) {
            throw new BusinessException("URL 别名已存在：" + slug);
        }
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
        response.setPublishStatus(project.getStatus());
        return response;
    }

    private String getStatusText(String status) {
        return switch (status) {
            case "online" -> "运行中";
            case "active" -> "活跃";
            case "offline" -> "已下线";
            case "archived" -> "已归档";
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
