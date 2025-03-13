package com.classy4j.service;

import java.util.List;
import java.util.Map;

import com.classy4j.model.Tool;

public interface ToolService {
    Tool registerTool(Tool tool);
    Tool getTool(Long id);
    List<Tool> getAllTools();
    Tool updateTool(Long id, Tool tool);
    void deleteTool(Long id);
    Object executeTool(Long toolId, Map<String, Object> parameters);
    List<Tool> getToolsByStatus(Tool.ToolStatus status);
    Tool getToolByName(String name);
} 