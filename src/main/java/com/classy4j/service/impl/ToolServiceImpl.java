package com.classy4j.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.classy4j.model.Tool;
import com.classy4j.repository.ToolRepository;
import com.classy4j.service.ToolService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ToolServiceImpl implements ToolService {

    private final ToolRepository toolRepository;

    @Override
    public Tool registerTool(Tool tool) {
        tool.setStatus(Tool.ToolStatus.ACTIVE);
        return toolRepository.save(tool);
    }

    @Override
    public Tool getTool(Long id) {
        return toolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tool not found"));
    }

    @Override
    public List<Tool> getAllTools() {
        return toolRepository.findAll();
    }

    @Override
    public Tool updateTool(Long id, Tool tool) {
        Tool existingTool = getTool(id);
        existingTool.setName(tool.getName());
        existingTool.setDescription(tool.getDescription());
        existingTool.setImplementation(tool.getImplementation());
        existingTool.setParameters(tool.getParameters());
        existingTool.setStatus(tool.getStatus());
        return toolRepository.save(existingTool);
    }

    @Override
    public void deleteTool(Long id) {
        toolRepository.deleteById(id);
    }

    @Override
    public Object executeTool(Long toolId, Map<String, Object> parameters) {
        Tool tool = getTool(toolId);
        if (tool.getStatus() != Tool.ToolStatus.ACTIVE) {
            throw new RuntimeException("Tool is not active");
        }

        try {
            // TODO: 实现工具执行逻辑
            // 1. 验证参数
            validateParameters(tool, parameters);
            // 2. 加载并执行工具实现
            return executeToolImplementation(tool, parameters);
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute tool", e);
        }
    }

    @Override
    public List<Tool> getToolsByStatus(Tool.ToolStatus status) {
        return toolRepository.findByStatus(status);
    }

    @Override
    public Tool getToolByName(String name) {
        return toolRepository.findByName(name);
    }

    private void validateParameters(Tool tool, Map<String, Object> parameters) {
        for (Tool.ToolParameter param : tool.getParameters()) {
            if (param.isRequired() && !parameters.containsKey(param.getName())) {
                throw new RuntimeException("Missing required parameter: " + param.getName());
            }
            // TODO: 添加参数类型验证
        }
    }

    private Object executeToolImplementation(Tool tool, Map<String, Object> parameters) {
        try {
            // TODO: 实现动态加载和执行工具实现的逻辑
            // 1. 加载工具实现类
            Class<?> implementationClass = Class.forName(tool.getImplementation());
            // 2. 创建实例
            Object instance = implementationClass.getDeclaredConstructor().newInstance();
            // 3. 查找和调用执行方法
            return implementationClass.getMethod("execute", Map.class)
                    .invoke(instance, parameters);
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute tool implementation", e);
        }
    }
} 