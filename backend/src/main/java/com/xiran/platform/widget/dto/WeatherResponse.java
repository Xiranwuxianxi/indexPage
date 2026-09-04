package com.xiran.platform.widget.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 天气响应 DTO
 *
 * 由后端代理 open-meteo 后返回，字段对齐前端渲染所需。
 * 外网不可达时 source = "fallback"，表示走固定兜底数据。
 */
@Data
@AllArgsConstructor
public class WeatherResponse {

    /** 城市 key：beijing / london / newyork */
    private String city;

    /** 城市中文名 */
    private String cityName;

    /** 国家 */
    private String country;

    /** 当前温度（°C） */
    private Double temperature;

    /** 温度单位 */
    private String unit;

    /** WMO weather code */
    private Integer weatherCode;

    /** 天气中文描述 */
    private String description;

    /** 天气 emoji 图标 */
    private String icon;

    /** 风速（km/h） */
    private Double windSpeed;

    /** 数据来源：open-meteo（实时）或 fallback（兜底） */
    private String source;

    /** 观测时间 */
    private String observedAt;
}
