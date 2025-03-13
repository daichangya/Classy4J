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

import com.classy4j.model.Tool;
import com.classy4j.service.ToolService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tools")
public class ToolController {

    private final ToolService toolService;

    @PostMapping
    public ResponseEntity<Tool> registerTool(@RequestBody Tool tool) {
        return ResponseEntity.ok(toolService.registerTool(tool));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tool> getTool(@PathVariable Long id) {
        return ResponseEntity.ok(toolService.getTool(id));
    }

    @GetMapping
    public ResponseEntity<List<Tool>> getAllTools() {
        return ResponseEntity.ok(toolService.getAllTools());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tool> updateTool(@PathVariable Long id, @RequestBody Tool tool) {
        return ResponseEntity.ok(toolService.updateTool(id, tool));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        toolService.deleteTool(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<Object> executeTool(
            @PathVariable Long id,
            @RequestBody Map<String, Object> parameters) {
        return ResponseEntity.ok(toolService.executeTool(id, parameters));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Tool>> getToolsByStatus(@PathVariable Tool.ToolStatus status) {
        return ResponseEntity.ok(toolService.getToolsByStatus(status));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Tool> getToolByName(@PathVariable String name) {
        return ResponseEntity.ok(toolService.getToolByName(name));
    }
} 