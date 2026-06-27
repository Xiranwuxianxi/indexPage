package com.xiran.platform.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiran.platform.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
