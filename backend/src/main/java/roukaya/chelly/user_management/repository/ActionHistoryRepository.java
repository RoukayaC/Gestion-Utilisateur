package roukaya.chelly.usermanagement.repository;

import roukaya.chelly.usermanagement.model.ActionHistory;
import roukaya.chelly.usermanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ActionHistoryRepository extends JpaRepository<ActionHistory, Long> {
    List<ActionHistory> findByUser(User user);
    List<ActionHistory> findByDateBetween(LocalDateTime start, LocalDateTime end);
}