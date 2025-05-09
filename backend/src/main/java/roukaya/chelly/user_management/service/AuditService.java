package roukaya.chelly.usermanagement.service;

import roukaya.chelly.usermanagement.model.ActionHistory;
import roukaya.chelly.usermanagement.model.User;
import roukaya.chelly.usermanagement.repository.ActionHistoryRepository;
import roukaya.chelly.usermanagement.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    private final ActionHistoryRepository actionHistoryRepository;
    private final UserRepository userRepository;

    public AuditService(ActionHistoryRepository actionHistoryRepository, UserRepository userRepository) {
        this.actionHistoryRepository = actionHistoryRepository;
        this.userRepository = userRepository;
    }

    public void logAction(String action, String details) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail).orElse(null);
            
            if (user != null) {
                logAction(user, action, details);
            }
        }
    }

    public void logAction(User user, String action, String details) {
        ActionHistory history = new ActionHistory();
        history.setUser(user);
        history.setAction(action);
        history.setDetails(details);
        history.setDate(LocalDateTime.now());
        
        actionHistoryRepository.save(history);
    }

    public List<ActionHistory> getUserActions(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return actionHistoryRepository.findByUser(user);
        }
        return List.of();
    }

    public List<ActionHistory> getActionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return actionHistoryRepository.findByDateBetween(start, end);
    }

    public List<ActionHistory> getAllActions() {
        return actionHistoryRepository.findAll();
    }
}