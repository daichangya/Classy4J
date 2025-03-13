package com.classy4j.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classy4j.model.Tool;

@Repository
public interface ToolRepository extends JpaRepository<Tool, Long> {
    List<Tool> findByStatus(Tool.ToolStatus status);
    Tool findByName(String name);
} 