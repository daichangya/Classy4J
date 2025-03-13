package com.classy4j.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.classy4j.model.Agent;
import com.classy4j.repository.AgentRepository;
import com.classy4j.service.AgentService;

import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;
    private final ChatLanguageModel chatModel;

    @Override
    public Agent createAgent(Agent agent) {
        agent.setStatus(Agent.AgentStatus.IDLE);
        return agentRepository.save(agent);
    }

    @Override
    public Agent getAgent(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
    }

    @Override
    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    @Override
    public Agent updateAgent(Long id, Agent agent) {
        Agent existingAgent = getAgent(id);
        existingAgent.setName(agent.getName());
        existingAgent.setDescription(agent.getDescription());
        existingAgent.setTools(agent.getTools());
        existingAgent.setWorkflow(agent.getWorkflow());
        existingAgent.setConfiguration(agent.getConfiguration());
        return agentRepository.save(existingAgent);
    }

    @Override
    public void deleteAgent(Long id) {
        agentRepository.deleteById(id);
    }

    @Override
    public Object executeTask(Long agentId, String task, Map<String, Object> parameters) {
        Agent agent = getAgent(agentId);
        agent.setStatus(Agent.AgentStatus.RUNNING);
        agentRepository.save(agent);

        try {
            // TODO: 实现工作流执行逻辑
            String prompt = String.format("Execute task: %s with parameters: %s using tools: %s",
                    task, parameters, agent.getTools());
            String result = chatModel.generate(prompt);

            agent.setStatus(Agent.AgentStatus.IDLE);
            agentRepository.save(agent);

            return result;
        } catch (Exception e) {
            agent.setStatus(Agent.AgentStatus.ERROR);
            agentRepository.save(agent);
            throw new RuntimeException("Failed to execute task", e);
        }
    }

    @Override
    public List<Agent> getAgentsByStatus(Agent.AgentStatus status) {
        return agentRepository.findByStatus(status);
    }

    @Override
    public List<Agent> getAgentsByTool(String tool) {
        return agentRepository.findByToolsContaining(tool);
    }
} 