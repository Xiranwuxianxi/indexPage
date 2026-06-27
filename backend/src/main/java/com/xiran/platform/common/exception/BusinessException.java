package com.xiran.platform.common.exception;

import lombok.Getter;

/**
 * 业务异常
 *
 * 用于区分可预期的业务错误（如参数错误、资源不存在）与系统未知异常。
 */
@Getter
public class BusinessException extends RuntimeException {

    private final Integer code;

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(String message) {
        this(400, message);
    }
}
