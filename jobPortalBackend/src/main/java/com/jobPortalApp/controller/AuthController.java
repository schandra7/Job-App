// src/main/java/com/jobPortalApp/controller/AuthController.java
package com.jobPortalApp.controller;

import com.jobPortalApp.dto.AuthResponse;
import com.jobPortalApp.dto.LoginRequest;
import com.jobPortalApp.dto.RegisterRequest;
import com.jobPortalApp.model.AppUser;
import com.jobPortalApp.model.Role;
import com.jobPortalApp.repository.UserRepository;
import com.jobPortalApp.security.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        AppUser user = AppUser.builder()
                .username(req.getUsername())
                .password(encoder.encode(req.getPassword()))
                .role(Role.EMPLOYEE)
                .enabled(true)
                .build();

        userRepo.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        AppUser user = userRepo.findByUsername(req.getUsername()).orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getUsername());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId()));
    }
}
