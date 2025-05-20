package roukaya.chelly.user_management.config;

import roukaya.chelly.user_management.model.Permission;
import roukaya.chelly.user_management.model.Role;
import roukaya.chelly.user_management.model.User;
import roukaya.chelly.user_management.repository.PermissionRepository;
import roukaya.chelly.user_management.repository.RoleRepository;
import roukaya.chelly.user_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            PermissionRepository permissionRepository,
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Create permissions if they don't exist
            if (permissionRepository.count() == 0) {
                Permission viewUsers = new Permission(null, "VIEW_USERS", "Can view users");
                Permission createUsers = new Permission(null, "CREATE_USERS", "Can create users");
                Permission updateUsers = new Permission(null, "UPDATE_USERS", "Can update users");
                Permission deleteUsers = new Permission(null, "DELETE_USERS", "Can delete users");

                Permission viewRoles = new Permission(null, "VIEW_ROLES", "Can view roles");
                Permission createRoles = new Permission(null, "CREATE_ROLES", "Can create roles");
                Permission updateRoles = new Permission(null, "UPDATE_ROLES", "Can update roles");
                Permission deleteRoles = new Permission(null, "DELETE_ROLES", "Can delete roles");

                Permission viewPermissions = new Permission(null, "VIEW_PERMISSIONS", "Can view permissions");
                Permission createPermissions = new Permission(null, "CREATE_PERMISSIONS", "Can create permissions");
                Permission updatePermissions = new Permission(null, "UPDATE_PERMISSIONS", "Can update permissions");
                Permission deletePermissions = new Permission(null, "DELETE_PERMISSIONS", "Can delete permissions");

                Permission viewAuditLogs = new Permission(null, "VIEW_AUDIT_LOGS", "Can view audit logs");

                permissionRepository.saveAll(Arrays.asList(
                        viewUsers, createUsers, updateUsers, deleteUsers,
                        viewRoles, createRoles, updateRoles, deleteRoles,
                        viewPermissions, createPermissions, updatePermissions, deletePermissions,
                        viewAuditLogs));
            }

            // Create roles if they don't exist
            if (roleRepository.count() == 0) {
                // Get all permissions
                Set<Permission> allPermissions = new HashSet<>(permissionRepository.findAll());

                // Admin role with all permissions
                Role adminRole = new Role();
                adminRole.setName("ADMIN");
                adminRole.setDescription("Administrator with all permissions");
                adminRole.setPermissions(allPermissions);
                roleRepository.save(adminRole);

                // User role with limited permissions
                Role userRole = new Role();
                userRole.setName("USER");
                userRole.setDescription("Regular user with limited permissions");

              
                Set<Permission> userPermissions = new HashSet<>();
                permissionRepository.findByName("VIEW_USERS").ifPresent(userPermissions::add);
                userRole.setPermissions(userPermissions);

                roleRepository.save(userRole);
            }

           // Create admin user if no users exist
if (userRepository.count() == 0) {
    Role adminRole = roleRepository.findByName("ADMIN")
            .orElseThrow(() -> new RuntimeException("Admin role not found"));

    User adminUser = new User();
    adminUser.setName("Admin User");
    adminUser.setEmail("roukaya@gmail.com");
    adminUser.setPassword(passwordEncoder.encode("roukaya2000"));
    adminUser.setActive(true);
    adminUser.setRoles(Set.of(adminRole));
    userRepository.save(adminUser);
    
    System.out.println("Admin user created with email: " + adminUser.getEmail());
    System.out.println("Admin permissions: " + 
        adminRole.getPermissions().stream()
            .map(Permission::getName)
            .collect(Collectors.joining(", ")));
}
        };
    }
}