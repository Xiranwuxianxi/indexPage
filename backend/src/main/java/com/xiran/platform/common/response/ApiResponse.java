package com.xiran.platform.common.response;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

/**
 * 统一 API 响应对象
 *
 * 所有接口（包括成功与失败）均返回此结构，便于前端统一处理。
 *
 * @param <T> 业务数据类型
 */
@Data
public class ApiResponse<T> {

    /**
     * 业务状态码，200 表示成功
     */
    private Integer code;

    /**
     * 提示信息
     */
    private String message;

    /**
     * 业务数据
     */
    private T data;

    /**
     * 请求追踪 ID，便于日志排查
     */
    private String requestId;

    /**
     * 响应时间戳（毫秒）
     */
    private Long timestamp;

    public ApiResponse() {
        this.requestId = UUID.randomUUID().toString().replace("-", "");
        this.timestamp = Instant.now().toEpochMilli();
    }

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        return response;
    }

    public static <T> ApiResponse<T> success() {
        return success(null);
    }

    public static <T> ApiResponse<T> error(Integer code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(500, message);
    }
}
