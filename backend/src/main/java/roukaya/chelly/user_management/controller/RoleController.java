package roukaya.chelly.usermanagement.controller;

import roukaya.chelly.usermanagement.model.Role;
import roukaya.chelly.usermanagement.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_ROLES')")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_ROLES')")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        Role role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ROLES')")
    public ResponseEntity<Role> createRole(@Valid @RequestBody Role role) {
        Role createdRole = roleService.createRole(role);
        return ResponseEntity.ok(createdRole);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ROLES')")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @Valid @RequestBody Role roleDetails) {
        Role updatedRole = roleService.updateRole(id, roleDetails);
        return ResponseEntity.ok(updatedRole);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_ROLES')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{roleId}/permissions")
    @PreAuthorize("hasAuthority('UPDATE_ROLES')")
    public ResponseEntity<Role> addPermissionsToRole(
            @PathVariable Long roleId, @RequestBody Set<Long> permissionIds) {
        Role updatedRole = roleService.addPermissionsToRole(roleId, permissionIds);
        return ResponseEntity.ok(updatedRole);
    }

    @DeleteMapping("/{roleId}/permissions")
    @PreAuthorize("hasAuthority('UPDATE_ROLES')")
    public ResponseEntity<Role> removePermissionsFromRole(
            @PathVariable Long roleId, @RequestBody Set<Long> permissionIds) {
        Role updatedRole = roleService.removePermissionsFromRole(roleId, permissionIds);
        return ResponseEntity.ok(updatedRole);
    }
}