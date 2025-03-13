package com.classy4j.service;

import java.util.List;
import java.util.Map;

import com.classy4j.model.Workflow;

public interface WorkflowService {
    Workflow createWorkflow(Workflow workflow);
    Workflow getWorkflow(Long id);
    List<Workflow> getAllWorkflows();
    Workflow updateWorkflow(Long id, Workflow workflow);
    void deleteWorkflow(Long id);
    Object executeWorkflow(Long workflowId, Map<String, Object> parameters);
    List<Workflow> getWorkflowsByStatus(Workflow.WorkflowStatus status);
    Workflow getWorkflowByName(String name);
} 