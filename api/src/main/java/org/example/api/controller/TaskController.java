package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.TaskDTO;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DefaultResponse<List<TaskDTO>>> getAllTasks() {
        List<TaskDTO> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(
                new DefaultResponse<>("Tasks retrieved successfully", true, tasks)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DefaultResponse<TaskDTO>> getTaskById(@PathVariable UUID id) {
        Optional<TaskDTO> taskOpt = taskService.getTaskById(id);

        if (taskOpt.isPresent()) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Task retrieved successfully", true, taskOpt.get())
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Task not found", false, null));
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DefaultResponse<TaskDTO>> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        TaskDTO createdTask = taskService.createTask(taskDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new DefaultResponse<>("Task created successfully", true, createdTask));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DefaultResponse<TaskDTO>> updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody TaskDTO taskDTO) {

        taskDTO.setId(id);
        try {
            TaskDTO updatedTask = taskService.updateTask(taskDTO);
            return ResponseEntity.ok(
                    new DefaultResponse<>("Task updated successfully", true, updatedTask)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>(e.getMessage(), false, null));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DefaultResponse<Void>> deleteTask(@PathVariable UUID id) {
        boolean deleted = taskService.deleteTask(id);

        if (deleted) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Task deleted successfully", true, null)
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Task not found", false, null));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DefaultResponse<TaskDTO>> updateTaskStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {

        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>("Status is required", false, null));
        }

        try {
            TaskDTO updatedTask = taskService.updateTaskStatus(id, status);
            return ResponseEntity.ok(
                    new DefaultResponse<>("Task status updated successfully", true, updatedTask)
            );
        } catch (RuntimeException e) {
            HttpStatus errorStatus = e.getMessage().contains("not found") ?
                    HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(errorStatus)
                    .body(new DefaultResponse<>(e.getMessage(), false, null));
        }
    }
}