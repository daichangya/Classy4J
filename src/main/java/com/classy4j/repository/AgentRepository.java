package com.classy4j.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classy4j.model.Agent;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    List<Agent> findByStatus(Agent.AgentStatus status);
    List<Agent> findByToolsContaining(String tool);
} 