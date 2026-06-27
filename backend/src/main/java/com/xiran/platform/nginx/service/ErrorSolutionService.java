package com.xiran.platform.nginx.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiran.platform.nginx.dto.ErrorSolutionResponse;
import com.xiran.platform.nginx.entity.ErrorSolution;
import com.xiran.platform.nginx.mapper.ErrorSolutionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ErrorSolutionService {

    private final ErrorSolutionMapper errorSolutionMapper;

    public Page<ErrorSolutionResponse> list(int page, int size) {
        Page<ErrorSolution> entityPage = listEntities(page, size);
        List<ErrorSolutionResponse> records = entityPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        Page<ErrorSolutionResponse> responsePage = new Page<>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal());
        responsePage.setRecords(records);
        return responsePage;
    }

    public Page<ErrorSolution> listEntities(int page, int size) {
        LambdaQueryWrapper<ErrorSolution> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ErrorSolution::getStatus, 1);
        wrapper.eq(ErrorSolution::getDeleted, 0);
        wrapper.orderByDesc(ErrorSolution::getUpdatedAt);
        return errorSolutionMapper.selectPage(new Page<>(page, size), wrapper);
    }

    public ErrorSolutionResponse getBySlug(String slug) {
        LambdaQueryWrapper<ErrorSolution> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ErrorSolution::getSlug, slug);
        wrapper.eq(ErrorSolution::getStatus, 1);
        wrapper.eq(ErrorSolution::getDeleted, 0);
        ErrorSolution errorSolution = errorSolutionMapper.selectOne(wrapper);
        return errorSolution == null ? null : convertToResponse(errorSolution);
    }

    private ErrorSolutionResponse convertToResponse(ErrorSolution error) {
        ErrorSolutionResponse response = new ErrorSolutionResponse();
        response.setId(error.getId());
        response.setSlug(error.getSlug());
        response.setOriginal(error.getOriginalText());
        response.setTitle(error.getTitle());
        response.setCategory(error.getCategory());
        response.setSummary(error.getSummary());
        response.setCause(error.getCause());
        response.setScenario(error.getScenario());
        response.setWrongExample(error.getWrongExample());
        response.setCorrectExample(error.getCorrectExample());
        response.setSolution(error.getSolution());
        response.setVerifyCommand(error.getVerifyCommand());
        response.setMisunderstanding(error.getMisunderstanding());
        response.setUpdatedAt(error.getUpdatedAt());
        response.setHref("/errors/" + error.getCategory() + "/" + error.getSlug());
        return response;
    }
}
