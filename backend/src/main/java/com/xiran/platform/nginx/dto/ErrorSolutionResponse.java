package com.xiran.platform.nginx.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ErrorSolutionResponse {
    private Long id;
    private String slug;
    private String original;
    private String title;
    private String category;
    private String summary;
    private String cause;
    private String scenario;
    private String wrongExample;
    private String correctExample;
    private String solution;
    private String verifyCommand;
    private String misunderstanding;
    private LocalDateTime updatedAt;
    private String href;
}
