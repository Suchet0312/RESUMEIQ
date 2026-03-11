package com.mineapp.hello.service;

import com.mineapp.hello.model.User;
import com.mineapp.hello.repository.UserRepository;
import com.mineapp.hello.security.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

public AuthService(UserRepository userRepository,
                   BCryptPasswordEncoder passwordEncoder,
                   JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
}


    public void register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);
    }
    public String login(String email, String password) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    boolean passwordMatches =
            passwordEncoder.matches(password, user.getPassword());

    if (!passwordMatches) {
        throw new RuntimeException("Invalid password");
    }
    return jwtUtil.generateToken(user.getEmail());
}

}
