package roukaya.chelly.user_management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import roukaya.chelly.user_management.dto.LoginRequest;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = new JwtUtils(); 
        setFilterProcessesUrl("/api/auth/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            // Add debug logging
            System.out.println("JwtAuthenticationFilter: Attempting authentication");

            LoginRequest credentials = new ObjectMapper().readValue(request.getInputStream(), LoginRequest.class);
            System.out.println("Login attempt with email: " + credentials.getEmail());

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            credentials.getEmail(),
                            credentials.getPassword(),
                            new ArrayList<>()));
        } catch (IOException e) {
            System.err.println("JwtAuthenticationFilter: Error reading request");
            e.printStackTrace();
            throw new RuntimeException("Could not read request", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            FilterChain chain, Authentication authResult)
            throws IOException, ServletException {
        System.out.println("Authentication successful, generating token");


        // Generate JWT token
        String token = jwtUtils.generateJwtToken(authResult);

        // Create response body
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", token);
        responseBody.put("type", "Bearer");

        // Get user details from authentication
        UserDetails userDetails = (UserDetails) authResult.getPrincipal();
        Map<String, Object> user = new HashMap<>();
        user.put("email", userDetails.getUsername());
        // Add more user details if needed

        responseBody.put("user", user);

        // Set response headers
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Write the response
        new ObjectMapper().writeValue(response.getOutputStream(), responseBody);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException, ServletException {
        // Add debug logging
        System.out.println("JwtAuthenticationFilter: Authentication failed: " + failed.getMessage());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Authentication failed");
        errorResponse.put("message", failed.getMessage());

        new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
    }
}