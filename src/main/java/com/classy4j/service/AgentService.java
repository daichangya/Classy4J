package com.classy4j.service;

import java.util.List;
import java.util.Map;

import com.classy4j.model.Agent;

public interface AgentService {
    Agent createAgent(Agent agent);
    Agent getAgent(Long id);
    List<Agent> getAllAgents();
    Agent updateAgent(Long id, Agent agent);
    void deleteAgent(Long id);
    Object executeTask(Long agentId, String task, Map<String, Object> parameters);
    List<Agent> getAgentsByStatus(Agent.AgentStatus status);
    List<Agent> getAgentsByTool(String tool);
} 