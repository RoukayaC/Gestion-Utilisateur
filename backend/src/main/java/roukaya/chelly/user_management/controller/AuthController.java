package roukaya.chelly.user_management.controller;

import roukaya.chelly.user_management.dto.CreateUserRequest;
import roukaya.chelly.user_management.dto.JwtResponse;
import roukaya.chelly.user_management.dto.LoginRequest;
import roukaya.chelly.user_management.dto.UserDto;
import roukaya.chelly.user_management.security.JwtUtils;
import roukaya.chelly.user_management.service.AuditService;
import roukaya.chelly.user_management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuditService auditService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService,
                         JwtUtils jwtUtils, AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.auditService = auditService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("AuthController.authenticateUser called with email: " + loginRequest.getEmail());
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDto userDetails = userService.getUserByEmail(loginRequest.getEmail());
        
        auditService.logAction("USER_LOGIN", "User logged in: " + loginRequest.getEmail());
        
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody CreateUserRequest signUpRequest) {
        try {
            System.out.println("Received registration request for: " + signUpRequest.getEmail());
            // Check if email already exists
            if (userService.emailExists(signUpRequest.getEmail())) {
                System.out.println("Registration failed: Email already exists: " + signUpRequest.getEmail());
                return ResponseEntity.badRequest().body("Email is already in use");
            }
            
            UserDto userDto = userService.createUser(signUpRequest);
            System.out.println("User successfully registered: " + userDto.getEmail() + " with ID: " + userDto.getId());
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}