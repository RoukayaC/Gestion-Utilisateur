package roukaya.chelly.user_management.controller;

import roukaya.chelly.user_management.model.ActionHistory;
import roukaya.chelly.user_management.service.AuditService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_AUDIT_LOGS')")
    public ResponseEntity<List<ActionHistory>> getAllActions() {
        List<ActionHistory> actions = auditService.getAllActions();
        return ResponseEntity.ok(actions);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('VIEW_AUDIT_LOGS')")
    public ResponseEntity<List<ActionHistory>> getUserActions(@PathVariable Long userId) {
        List<ActionHistory> actions = auditService.getUserActions(userId);
        return ResponseEntity.ok(actions);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAuthority('VIEW_AUDIT_LOGS')")
    public ResponseEntity<List<ActionHistory>> getActionsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<ActionHistory> actions = auditService.getActionsByDateRange(start, end);
        return ResponseEntity.ok(actions);
    }
}