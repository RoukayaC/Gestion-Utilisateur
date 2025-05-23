package roukaya.chelly.user_management.service;

import roukaya.chelly.user_management.exception.ResourceNotFoundException;
import roukaya.chelly.user_management.model.Permission;
import roukaya.chelly.user_management.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final AuditService auditService;

    public PermissionService(PermissionRepository permissionRepository, AuditService auditService) {
        this.permissionRepository = permissionRepository;
        this.auditService = auditService;
    }

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public Permission getPermissionById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
    }

    @Transactional
    public Permission createPermission(Permission permission) {
        // Check if permission with same name already exists
        if (permissionRepository.findByName(permission.getName()).isPresent()) {
            throw new IllegalArgumentException("Permission with name '" + permission.getName() + "' already exists");
        }
        
        Permission savedPermission = permissionRepository.save(permission);
        auditService.logAction("PERMISSION_CREATED", "Permission created: " + permission.getName());
        return savedPermission;
    }

    @Transactional
    public Permission updatePermission(Long id, Permission permissionDetails) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        
        // Check if new name conflicts with existing permission 
        if (!permission.getName().equals(permissionDetails.getName())) {
            if (permissionRepository.findByName(permissionDetails.getName()).isPresent()) {
                throw new IllegalArgumentException("Permission with name '" + permissionDetails.getName() + "' already exists");
            }
        }
        
        permission.setName(permissionDetails.getName());
        permission.setDescription(permissionDetails.getDescription());
        
        Permission updatedPermission = permissionRepository.save(permission);
        auditService.logAction("PERMISSION_UPDATED", "Permission updated: " + permission.getName());
        
        return updatedPermission;
    }

    @Transactional
    public void deletePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        
        permissionRepository.delete(permission);
        auditService.logAction("PERMISSION_DELETED", "Permission deleted: " + permission.getName());
    }
}