package com.xiran.platform.auth.service;

import com.xiran.platform.auth.dto.LoginRequest;
import com.xiran.platform.auth.dto.RegisterRequest;
import com.xiran.platform.auth.dto.TokenResponse;
import com.xiran.platform.common.exception.BusinessException;
import com.xiran.platform.common.security.JwtUtil;
import com.xiran.platform.user.dto.UserProfileResponse;
import com.xiran.platform.user.entity.User;
import com.xiran.platform.user.mapper.UserMapper;
import com.xiran.platform.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public TokenResponse register(RegisterRequest request) {
        if (userService.findByEmail(request.getEmail()) != null) {
            throw new BusinessException("该邮箱已被注册");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        boolean hasNickname = request.getNickname() != null && !request.getNickname().isBlank();
        user.setNickname(hasNickname ? request.getNickname() : request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userMapper.insert(user);

        UserProfileResponse profile = userService.convertToProfile(user);

        TokenResponse response = new TokenResponse();
        response.setAccessToken(jwtUtil.generateAccessToken(user.getId(), user.getEmail(), user.getRole()));
        response.setRefreshToken(jwtUtil.generateRefreshToken(user.getId(), user.getEmail()));
        response.setExpiresIn(2592000L);
        response.setUser(profile);
        return response;
    }

    public TokenResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<User>().eq(User::getEmail, authentication.getName()));
        if (user == null) {
            throw new BusinessException("User not found");
        }

        UserProfileResponse profile = userService.convertToProfile(user);

        TokenResponse response = new TokenResponse();
        response.setAccessToken(jwtUtil.generateAccessToken(user.getId(), user.getEmail(), user.getRole()));
        response.setRefreshToken(jwtUtil.generateRefreshToken(user.getId(), user.getEmail()));
        response.setExpiresIn(2592000L);
        response.setUser(profile);
        return response;
    }
}
