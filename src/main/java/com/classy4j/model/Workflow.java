package com.classy4j.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Workflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @ElementCollection
    private List<WorkflowStep> steps;
    
    private WorkflowStatus status;
    
    @Embeddable
    @Data
    public static class WorkflowStep {
        private String type;
        private String targetId;
        private String task;
        
        @Column(columnDefinition = "TEXT")
        private String parameters;
    }
    
    public enum WorkflowStatus {
        DRAFT,
        ACTIVE,
        RUNNING,
        COMPLETED,
        ERROR
    }
} 