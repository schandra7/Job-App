package com.jobPortalApp.dto;


import com.jobPortalApp.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private Role role; // ADMIN / EMPLOYEE
}
