package roukaya.chelly.user_management.service;

import roukaya.chelly.user_management.dto.CreateUserRequest;
import roukaya.chelly.user_management.dto.UserDto;
import roukaya.chelly.user_management.exception.ResourceNotFoundException;
import roukaya.chelly.user_management.model.Role;
import roukaya.chelly.user_management.model.User;
import roukaya.chelly.user_management.repository.RoleRepository;
import roukaya.chelly.user_management.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, 
                      PasswordEncoder passwordEncoder, AuditService auditService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public List<UserDto> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        System.out.println("Found " + allUsers.size() + " users in database");
        allUsers.forEach(user -> {
            System.out.println("User: " + user.getEmail() + ", Roles: " + 
                user.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")));
        });
        
        return allUsers.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToDto(user);
    }
    
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public UserDto updateProfile(String email, Map<String, String> profileData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (profileData.containsKey("name")) {
            user.setName(profileData.get("name"));
        }

        
        if (profileData.containsKey("email") && !user.getEmail().equals(profileData.get("email"))) {
            String newEmail = profileData.get("email");
            if (userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email is already in use");
            }
            user.setEmail(newEmail);
        }

        User updatedUser = userRepository.save(user);
        auditService.logAction("PROFILE_UPDATED", "Profile updated for user: " + user.getEmail());
        
        return convertToDto(updatedUser);
    }

    @Transactional
    public boolean changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        auditService.logAction("PASSWORD_CHANGED", "Password changed for user: " + user.getEmail());
        return true;
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        System.out.println("Creating user with email: " + request.getEmail());
        if (request.getRoles() != null) {
            System.out.println("Roles requested: " + request.getRoles());
        } else {
            System.out.println("No roles specified, will assign default USER role");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
                roles.add(role);
            }
        } else {
            Role defaultRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
            roles.add(defaultRole);
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        
        System.out.println("User saved with ID: " + savedUser.getId() + " and roles: " + 
            savedUser.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")));
            
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getPrincipal().equals("anonymousUser")) {
            auditService.logAction("USER_CREATED", "User created: " + user.getEmail());
        }
        
        return convertToDto(savedUser);
    }

    @Transactional
    public UserDto updateUser(Long id, CreateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
                roles.add(role);
            }
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        auditService.logAction("USER_UPDATED", "User updated: " + user.getEmail());
        
        return convertToDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        userRepository.delete(user);
        auditService.logAction("USER_DELETED", "User deleted: " + user.getEmail());
    }

    @Transactional
    public UserDto toggleUserActive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setActive(!user.isActive());
        User updatedUser = userRepository.save(user);
        
        String action = user.isActive() ? "USER_ACTIVATED" : "USER_DEACTIVATED";
        auditService.logAction(action, "User status changed: " + user.getEmail());
        
        return convertToDto(updatedUser);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setActive(user.isActive());
        
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        dto.setRoles(roleNames);
        
        return dto;
    }
}