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
public class Tool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String implementation;
    
    @ElementCollection
    private List<ToolParameter> parameters;
    
    private ToolStatus status;
    
    @Embeddable
    @Data
    public static class ToolParameter {
        private String name;
        private String type;
        private String description;
        private boolean required;
        private String defaultValue;
    }
    
    public enum ToolStatus {
        ACTIVE,
        INACTIVE,
        ERROR
    }
} 