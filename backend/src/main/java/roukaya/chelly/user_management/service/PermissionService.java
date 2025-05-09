package roukaya.chelly.usermanagement.service;

import roukaya.chelly.usermanagement.exception.ResourceNotFoundException;
import roukaya.chelly.usermanagement.model.Permission;
import roukaya.chelly.usermanagement.repository.PermissionRepository;
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
        Permission savedPermission = permissionRepository.save(permission);
        auditService.logAction("PERMISSION_CREATED", "Permission created: " + permission.getName());
        return savedPermission;
    }

    @Transactional
    public Permission updatePermission(Long id, Permission permissionDetails) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        
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