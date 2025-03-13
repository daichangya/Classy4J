package com.classy4j.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classy4j.model.Workflow;
import com.classy4j.service.WorkflowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    @PostMapping
    public ResponseEntity<Workflow> createWorkflow(@RequestBody Workflow workflow) {
        return ResponseEntity.ok(workflowService.createWorkflow(workflow));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workflow> getWorkflow(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getWorkflow(id));
    }

    @GetMapping
    public ResponseEntity<List<Workflow>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workflow> updateWorkflow(@PathVariable Long id, @RequestBody Workflow workflow) {
        return ResponseEntity.ok(workflowService.updateWorkflow(id, workflow));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<Object> executeWorkflow(
            @PathVariable Long id,
            @RequestBody Map<String, Object> parameters) {
        return ResponseEntity.ok(workflowService.executeWorkflow(id, parameters));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Workflow>> getWorkflowsByStatus(@PathVariable Workflow.WorkflowStatus status) {
        return ResponseEntity.ok(workflowService.getWorkflowsByStatus(status));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Workflow> getWorkflowByName(@PathVariable String name) {
        return ResponseEntity.ok(workflowService.getWorkflowByName(name));
    }
} 