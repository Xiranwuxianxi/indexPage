package com.xiran.platform.widget.controller;

import com.xiran.platform.common.response.ApiResponse;
import com.xiran.platform.widget.dto.WeatherResponse;
import com.xiran.platform.widget.service.WidgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 首页小组件接口：平台入口、实用工具、世界时钟、天气
 *
 * 全部为 GET 公开接口（SecurityConfig 已放行 /api/v1/widgets/**）。
 */
@RestController
@RequestMapping("/api/v1/widgets")
@RequiredArgsConstructor
@Tag(name = "Widget", description = "首页小组件：平台入口、实用工具、世界时钟、天气")
public class WidgetController {

    private final WidgetService widgetService;

    @GetMapping
    @Operation(summary = "平台入口与实用工具列表")
    public ApiResponse<Map<String, Object>> widgets() {
        return ApiResponse.success(widgetService.getWidgets());
    }

    @GetMapping("/world-clock")
    @Operation(summary = "北京/伦敦/纽约三地当前时间")
    public ApiResponse<Map<String, Object>> worldClock() {
        return ApiResponse.success(widgetService.getWorldClock());
    }

    @GetMapping("/weather")
    @Operation(summary = "指定城市当前天气（open-meteo 代理，外网不可达走兜底）")
    public ApiResponse<WeatherResponse> weather(
            @RequestParam(defaultValue = "beijing") String city) {
        return ApiResponse.success(widgetService.getWeather(city));
    }

    @GetMapping("/markets")
    @Operation(summary = "上证指数 / 纳斯达克 / 标普 500 实时行情（腾讯行情代理，外网不可达走兜底）")
    public ApiResponse<java.util.List<Map<String, Object>>> markets() {
        return ApiResponse.success(widgetService.getMarkets());
    }
}
