package roukaya.chelly.usermanagement.controller;

import roukaya.chelly.usermanagement.dto.CreateUserRequest;
import roukaya.chelly.usermanagement.dto.JwtResponse;
import roukaya.chelly.usermanagement.dto.LoginRequest;
import roukaya.chelly.usermanagement.dto.UserDto;
import roukaya.chelly.usermanagement.security.JwtUtils;
import roukaya.chelly.usermanagement.service.AuditService;
import roukaya.chelly.usermanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
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
        UserDto userDto = userService.createUser(signUpRequest);
        return ResponseEntity.ok(userDto);
    }
}