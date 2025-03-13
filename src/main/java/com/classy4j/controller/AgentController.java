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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.classy4j.model.Agent;
import com.classy4j.service.AgentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/agent")
public class AgentController {

    private final AgentService agentService;

    @PostMapping
    public ResponseEntity<Agent> createAgent(@RequestBody Agent agent) {
        return ResponseEntity.ok(agentService.createAgent(agent));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agent> getAgent(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getAgent(id));
    }

    @GetMapping
    public ResponseEntity<List<Agent>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agent> updateAgent(@PathVariable Long id, @RequestBody Agent agent) {
        return ResponseEntity.ok(agentService.updateAgent(id, agent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        agentService.deleteAgent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<Object> executeTask(
            @PathVariable Long id,
            @RequestParam String task,
            @RequestBody Map<String, Object> parameters) {
        return ResponseEntity.ok(agentService.executeTask(id, task, parameters));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Agent>> getAgentsByStatus(@PathVariable Agent.AgentStatus status) {
        return ResponseEntity.ok(agentService.getAgentsByStatus(status));
    }

    @GetMapping("/tool/{tool}")
    public ResponseEntity<List<Agent>> getAgentsByTool(@PathVariable String tool) {
        return ResponseEntity.ok(agentService.getAgentsByTool(tool));
    }
}