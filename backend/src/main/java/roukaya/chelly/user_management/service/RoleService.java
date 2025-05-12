package roukaya.chelly.user_management.service;

import roukaya.chelly.user_management.exception.ResourceNotFoundException;
import roukaya.chelly.user_management.model.Permission;
import roukaya.chelly.user_management.model.Role;
import roukaya.chelly.user_management.repository.PermissionRepository;
import roukaya.chelly.user_management.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final AuditService auditService;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository, 
                      AuditService auditService) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.auditService = auditService;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    public Role getRoleByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name: " + name));
    }

    @Transactional
    public Role createRole(Role role) {
        Role savedRole = roleRepository.save(role);
        auditService.logAction("ROLE_CREATED", "Role created: " + role.getName());
        return savedRole;
    }

    @Transactional
    public Role updateRole(Long id, Role roleDetails) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        
        role.setName(roleDetails.getName());
        role.setDescription(roleDetails.getDescription());
        
        Role updatedRole = roleRepository.save(role);
        auditService.logAction("ROLE_UPDATED", "Role updated: " + role.getName());
        
        return updatedRole;
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        
        roleRepository.delete(role);
        auditService.logAction("ROLE_DELETED", "Role deleted: " + role.getName());
    }

    @Transactional
    public Role addPermissionsToRole(Long roleId, Set<Long> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        Set<Permission> permissions = new HashSet<>();
        for (Long permissionId : permissionIds) {
            Permission permission = permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
            permissions.add(permission);
        }
        
        role.getPermissions().addAll(permissions);
        Role updatedRole = roleRepository.save(role);
        
        auditService.logAction("PERMISSIONS_ADDED_TO_ROLE", 
                             "Permissions added to role: " + role.getName());
        
        return updatedRole;
    }

    @Transactional
    public Role removePermissionsFromRole(Long roleId, Set<Long> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        for (Long permissionId : permissionIds) {
            role.getPermissions().removeIf(permission -> permission.getId().equals(permissionId));
        }
        
        Role updatedRole = roleRepository.save(role);
        auditService.logAction("PERMISSIONS_REMOVED_FROM_ROLE", 
                             "Permissions removed from role: " + role.getName());
        
        return updatedRole;
    }
}