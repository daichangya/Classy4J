package com.classy4j.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.classy4j.model.Workflow;
import com.classy4j.repository.WorkflowRepository;
import com.classy4j.service.AgentService;
import com.classy4j.service.ToolService;
import com.classy4j.service.WorkflowService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkflowServiceImpl implements WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final AgentService agentService;
    private final ToolService toolService;
    private final ObjectMapper objectMapper;

    @Override
    public Workflow createWorkflow(Workflow workflow) {
        workflow.setStatus(Workflow.WorkflowStatus.DRAFT);
        return workflowRepository.save(workflow);
    }

    @Override
    public Workflow getWorkflow(Long id) {
        return workflowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
    }

    @Override
    public List<Workflow> getAllWorkflows() {
        return workflowRepository.findAll();
    }

    @Override
    public Workflow updateWorkflow(Long id, Workflow workflow) {
        Workflow existingWorkflow = getWorkflow(id);
        existingWorkflow.setName(workflow.getName());
        existingWorkflow.setDescription(workflow.getDescription());
        existingWorkflow.setSteps(workflow.getSteps());
        existingWorkflow.setStatus(workflow.getStatus());
        return workflowRepository.save(existingWorkflow);
    }

    @Override
    public void deleteWorkflow(Long id) {
        workflowRepository.deleteById(id);
    }

    @Override
    public Object executeWorkflow(Long workflowId, Map<String, Object> parameters) {
        Workflow workflow = getWorkflow(workflowId);
        workflow.setStatus(Workflow.WorkflowStatus.RUNNING);
        workflowRepository.save(workflow);

        Object result = null;
        try {
            for (Workflow.WorkflowStep step : workflow.getSteps()) {
                result = executeStep(step, parameters);
                parameters.put("previousStepResult", result);
            }

            workflow.setStatus(Workflow.WorkflowStatus.COMPLETED);
            workflowRepository.save(workflow);
            return result;
        } catch (Exception e) {
            workflow.setStatus(Workflow.WorkflowStatus.ERROR);
            workflowRepository.save(workflow);
            throw new RuntimeException("Failed to execute workflow", e);
        }
    }

    @Override
    public List<Workflow> getWorkflowsByStatus(Workflow.WorkflowStatus status) {
        return workflowRepository.findByStatus(status);
    }

    @Override
    public Workflow getWorkflowByName(String name) {
        return workflowRepository.findByName(name);
    }

    private Object executeStep(Workflow.WorkflowStep step, Map<String, Object> parameters) {
        try {
            Map<String, Object> stepParams = objectMapper.readValue(step.getParameters(), Map.class);
            stepParams.putAll(parameters);

            switch (step.getType().toUpperCase()) {
                case "TOOL":
                    return toolService.executeTool(Long.parseLong(step.getTargetId()), stepParams);
                case "AGENT":
                    return agentService.executeTask(Long.parseLong(step.getTargetId()), step.getTask(), stepParams);
                default:
                    throw new RuntimeException("Unknown step type: " + step.getType());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute workflow step", e);
        }
    }
} 