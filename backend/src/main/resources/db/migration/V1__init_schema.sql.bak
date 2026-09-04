-- 希燃呀开发者平台数据库初始化脚本
-- 数据库：MySQL 8
-- 编码：utf8mb4

-- 用户与权限
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `username` VARCHAR(64) NOT NULL COMMENT '用户名',
    `email` VARCHAR(128) NOT NULL COMMENT '邮箱',
    `password` VARCHAR(255) COMMENT 'BCrypt 密码',
    `nickname` VARCHAR(64) COMMENT '昵称',
    `avatar` VARCHAR(255) COMMENT '头像 URL',
    `bio` TEXT COMMENT '个人简介',
    `role` VARCHAR(32) NOT NULL DEFAULT 'USER' COMMENT '角色：USER/EDITOR/ADMIN',
    `github_id` VARCHAR(64) COMMENT 'GitHub 用户 ID',
    `subscribed` TINYINT(1) DEFAULT 0 COMMENT '是否订阅更新',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_email` (`email`),
    UNIQUE KEY `uk_user_username` (`username`),
    KEY `idx_user_role` (`role`),
    KEY `idx_user_github` (`github_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE IF NOT EXISTS `oauth_account` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户 ID',
    `provider` VARCHAR(32) NOT NULL COMMENT 'OAuth 提供商',
    `provider_user_id` VARCHAR(128) NOT NULL COMMENT '提供商用户 ID',
    `provider_username` VARCHAR(128) COMMENT '提供商用户名',
    `access_token` VARCHAR(255) COMMENT 'Access Token',
    `refresh_token` VARCHAR(255) COMMENT 'Refresh Token',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_oauth_provider_user` (`provider`, `provider_user_id`),
    KEY `idx_oauth_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='OAuth 账号关联表';

-- 内容与分类
CREATE TABLE IF NOT EXISTS `category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL COMMENT '分类名称',
    `slug` VARCHAR(64) NOT NULL COMMENT 'URL 别名',
    `description` VARCHAR(255) COMMENT '描述',
    `type` VARCHAR(32) NOT NULL DEFAULT 'article' COMMENT '类型：article/tool/error/project',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_category_slug` (`slug`),
    KEY `idx_category_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

CREATE TABLE IF NOT EXISTS `tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL COMMENT '标签名称',
    `slug` VARCHAR(64) NOT NULL COMMENT 'URL 别名',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tag_slug` (`slug`),
    KEY `idx_tag_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

CREATE TABLE IF NOT EXISTS `article` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL COMMENT '标题',
    `slug` VARCHAR(128) NOT NULL COMMENT 'URL 别名',
    `summary` VARCHAR(500) COMMENT '摘要',
    `markdown_content` LONGTEXT COMMENT 'Markdown 内容',
    `html_content` LONGTEXT COMMENT 'HTML 内容',
    `cover` VARCHAR(255) COMMENT '封面图',
    `seo_title` VARCHAR(255) COMMENT 'SEO 标题',
    `seo_description` VARCHAR(500) COMMENT 'SEO 描述',
    `canonical_url` VARCHAR(255) COMMENT 'Canonical URL',
    `published_at` DATETIME COMMENT '发布时间',
    `view_count` BIGINT NOT NULL DEFAULT 0 COMMENT '阅读量',
    `author_id` BIGINT NOT NULL COMMENT '作者 ID',
    `category_id` BIGINT COMMENT '分类 ID',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 2 COMMENT '0禁用 1发布 2草稿',
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_article_slug` (`slug`),
    KEY `idx_article_status` (`status`),
    KEY `idx_article_category` (`category_id`),
    KEY `idx_article_published` (`published_at`),
    KEY `idx_article_author` (`author_id`),
    FULLTEXT KEY `ft_article_title_summary` (`title`, `summary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

CREATE TABLE IF NOT EXISTS `article_tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `article_id` BIGINT NOT NULL,
    `tag_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_article_tag` (`article_id`, `tag_id`),
    KEY `idx_article_tag_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章-标签关联表';

-- 项目
CREATE TABLE IF NOT EXISTS `project` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL COMMENT '项目名称',
    `slug` VARCHAR(128) NOT NULL COMMENT 'URL 别名',
    `summary` VARCHAR(500) COMMENT '简介',
    `description` LONGTEXT COMMENT '详细介绍',
    `cover` VARCHAR(255) COMMENT '封面图',
    `type` VARCHAR(32) COMMENT '类型',
    `project_status` VARCHAR(32) NOT NULL DEFAULT 'online' COMMENT '项目状态',
    `demo_url` VARCHAR(255) COMMENT '在线体验地址',
    `repo_url` VARCHAR(255) COMMENT '仓库地址',
    `tech_stack` VARCHAR(500) COMMENT '技术栈，逗号分隔',
    `icon` VARCHAR(32) COMMENT '图标',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status_flag` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_project_slug` (`slug`),
    KEY `idx_project_type` (`type`),
    KEY `idx_project_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

CREATE TABLE IF NOT EXISTS `project_tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT NOT NULL,
    `tag_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_project_tag` (`project_id`, `tag_id`),
    KEY `idx_project_tag_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目-标签关联表';

-- 工具
CREATE TABLE IF NOT EXISTS `tool_category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `slug` VARCHAR(64) NOT NULL,
    `description` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tool_category_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工具分类表';

CREATE TABLE IF NOT EXISTS `tool` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL COMMENT '工具名称',
    `slug` VARCHAR(128) NOT NULL COMMENT 'URL 别名',
    `summary` VARCHAR(500) COMMENT '简介',
    `description` LONGTEXT COMMENT '详细介绍',
    `category_id` BIGINT COMMENT '分类 ID',
    `icon` VARCHAR(32) COMMENT '图标',
    `usage_count` BIGINT NOT NULL DEFAULT 0 COMMENT '使用次数',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tool_slug` (`slug`),
    KEY `idx_tool_category` (`category_id`),
    KEY `idx_tool_usage` (`usage_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工具表';

CREATE TABLE IF NOT EXISTS `tool_execution` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tool_id` BIGINT NOT NULL,
    `user_id` BIGINT COMMENT '用户 ID',
    `input` LONGTEXT COMMENT '输入参数 JSON',
    `started_at` DATETIME,
    `finished_at` DATETIME,
    `success` TINYINT(1),
    `error_message` VARCHAR(500),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_tool_exec_tool` (`tool_id`),
    KEY `idx_tool_exec_user` (`user_id`),
    KEY `idx_tool_exec_success` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工具执行记录表';

CREATE TABLE IF NOT EXISTS `tool_result` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `execution_id` BIGINT NOT NULL,
    `output` LONGTEXT COMMENT '输出内容',
    `output_type` VARCHAR(32) COMMENT '输出类型',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tool_result_exec` (`execution_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工具执行结果表';

-- Nginx 旗舰功能
CREATE TABLE IF NOT EXISTS `nginx_template` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `description` VARCHAR(500),
    `template_content` LONGTEXT COMMENT '模板内容',
    `category` VARCHAR(64),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_nginx_template_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nginx 配置模板表';

CREATE TABLE IF NOT EXISTS `nginx_rule` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(64) NOT NULL COMMENT '规则编码',
    `level` VARCHAR(16) NOT NULL COMMENT '等级：ERROR/WARNING/INFO',
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `suggestion` TEXT,
    `example_before` TEXT,
    `example_after` TEXT,
    `tutorial_url` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_nginx_rule_code` (`code`),
    KEY `idx_nginx_rule_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nginx 检查规则表';

CREATE TABLE IF NOT EXISTS `saved_configuration` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `tool_slug` VARCHAR(128) NOT NULL,
    `config_content` LONGTEXT COMMENT '配置内容',
    `parameters` LONGTEXT COMMENT '生成参数 JSON',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_saved_config_user` (`user_id`),
    KEY `idx_saved_config_tool` (`tool_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户保存配置表';

CREATE TABLE IF NOT EXISTS `shared_configuration` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `saved_config_id` BIGINT NOT NULL,
    `share_code` VARCHAR(64) NOT NULL COMMENT '分享码',
    `expire_at` DATETIME COMMENT '过期时间',
    `view_count` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_shared_config_code` (`share_code`),
    KEY `idx_shared_config_saved` (`saved_config_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分享配置表';

CREATE TABLE IF NOT EXISTS `error_solution` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `original_text` TEXT NOT NULL COMMENT '错误原文',
    `slug` VARCHAR(128) NOT NULL COMMENT 'URL 别名',
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(64),
    `summary` VARCHAR(500),
    `cause` TEXT,
    `scenario` TEXT,
    `wrong_example` TEXT,
    `correct_example` TEXT,
    `solution` LONGTEXT,
    `verify_command` VARCHAR(500),
    `misunderstanding` TEXT,
    `related_tool_ids` VARCHAR(255),
    `related_article_ids` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_error_solution_slug` (`slug`),
    KEY `idx_error_solution_category` (`category`),
    FULLTEXT KEY `ft_error_original` (`original_text`, `title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='错误解决方案表';

-- 用户行为
CREATE TABLE IF NOT EXISTS `bookmark` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `target_type` VARCHAR(32) NOT NULL COMMENT 'article/tool/project/error',
    `target_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_bookmark_user_target` (`user_id`, `target_type`, `target_id`),
    KEY `idx_bookmark_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

CREATE TABLE IF NOT EXISTS `browsing_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `target_type` VARCHAR(32) NOT NULL,
    `target_id` BIGINT NOT NULL,
    `title` VARCHAR(255),
    `url` VARCHAR(500),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_history_user` (`user_id`),
    KEY `idx_history_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='浏览历史表';

CREATE TABLE IF NOT EXISTS `search_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT,
    `keyword` VARCHAR(255) NOT NULL,
    `has_result` TINYINT(1) DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_search_keyword` (`keyword`),
    KEY `idx_search_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索历史表';

CREATE TABLE IF NOT EXISTS `subscription` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(128) NOT NULL,
    `user_id` BIGINT,
    `type` VARCHAR(32) DEFAULT 'update',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_subscription_email_type` (`email`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订阅表';

CREATE TABLE IF NOT EXISTS `feedback` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT,
    `type` VARCHAR(32) NOT NULL,
    `content` TEXT NOT NULL,
    `contact` VARCHAR(128),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_feedback_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户反馈表';

-- 数据分析
CREATE TABLE IF NOT EXISTS `page_view` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `referrer` VARCHAR(500),
    `user_agent` VARCHAR(500),
    `ip` VARCHAR(64),
    `user_id` BIGINT,
    `session_id` VARCHAR(64),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_pv_url` (`url`),
    KEY `idx_pv_created` (`created_at`),
    KEY `idx_pv_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='页面访问统计表';

CREATE TABLE IF NOT EXISTS `daily_stat` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `stat_date` DATE NOT NULL,
    `uv` BIGINT NOT NULL DEFAULT 0,
    `pv` BIGINT NOT NULL DEFAULT 0,
    `new_users` BIGINT NOT NULL DEFAULT 0,
    `tool_executions` BIGINT NOT NULL DEFAULT 0,
    `tool_failures` BIGINT NOT NULL DEFAULT 0,
    `searches` BIGINT NOT NULL DEFAULT 0,
    `searches_without_result` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_daily_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日统计表';
