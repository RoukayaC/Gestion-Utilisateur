package com.example.usermanagement.repository;

import com.example.usermanagement.model.ActionHistory;
import com.example.usermanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ActionHistoryRepository extends JpaRepository<ActionHistory, Long> {
    List<ActionHistory> findByUser(User user);
    List<ActionHistory> findByDateBetween(LocalDateTime start, LocalDateTime end);
}