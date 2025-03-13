package com.classy4j.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @ElementCollection
    private List<String> tools;
    
    @Column(columnDefinition = "TEXT")
    private String workflow;
    
    private AgentStatus status;
    
    @Column(columnDefinition = "TEXT")
    private String configuration;
    
    public enum AgentStatus {
        IDLE,
        RUNNING,
        ERROR
    }
} 