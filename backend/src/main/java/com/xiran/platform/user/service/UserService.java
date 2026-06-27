package com.xiran.platform.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xiran.platform.common.security.JwtUtil;
import com.xiran.platform.user.dto.UserProfileResponse;
import com.xiran.platform.user.entity.User;
import com.xiran.platform.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    public UserProfileResponse getProfile(String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        User user = userMapper.selectById(userId);
        return convertToProfile(user);
    }

    public UserProfileResponse convertToProfile(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setNickname(user.getNickname());
        response.setEmail(user.getEmail());
        response.setAvatar(user.getAvatar());
        response.setBio(user.getBio());
        response.setRole(user.getRole());
        response.setSubscribed(user.getSubscribed());
        response.setGithub(user.getGithubId() != null ? "https://github.com/" + user.getGithubId() : null);
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    public User findByEmail(String email) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getEmail, email));
    }
}
