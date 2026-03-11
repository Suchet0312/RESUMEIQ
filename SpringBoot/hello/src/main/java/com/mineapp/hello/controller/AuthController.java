package com.mineapp.hello.controller;

import com.mineapp.hello.dto.LoginRequest;
import com.mineapp.hello.dto.UserResponse;
import com.mineapp.hello.service.AuthService;
import com.mineapp.hello.model.User;
import com.mineapp.hello.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    // ✅ FIXED REGISTER (NOW ACCEPTS JSON)
    @PostMapping("/register")
    public String register(@RequestBody LoginRequest request) {
        authService.register(
                request.getEmail(),
                request.getPassword()
        );
        return "User registered successfully";
    }

    // ✅ LOGIN (ALREADY CORRECT)
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(
                request.getEmail(),
                request.getPassword()
        );
    }
    @GetMapping("/me")
public UserResponse getMe(Authentication auth) {
    User user = userRepository.findByEmail(auth.getName())
        .orElseThrow();
    return new UserResponse(user.getId(), user.getEmail());
}

}
