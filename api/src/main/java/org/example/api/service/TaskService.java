package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.dto.TaskDTO;
import org.example.api.model.Task;
import org.example.api.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<TaskDTO> getTaskById(UUID id) {
        return taskRepository.findById(id)
                .map(TaskDTO::fromEntity);
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = taskDTO.toEntity();
        task.setId(null); // Ensure we create a new task
        task.setCreatedAt(ZonedDateTime.now());

        Task savedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(savedTask);
    }

    public TaskDTO updateTask(TaskDTO taskDTO) {
        if (!taskRepository.existsById(taskDTO.getId())) {
            throw new RuntimeException("Task not found");
        }

        Task task = taskDTO.toEntity();
        Task savedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(savedTask);
    }

    public boolean deleteTask(UUID id) {
        if (!taskRepository.existsById(id)) {
            return false;
        }

        taskRepository.deleteById(id);
        return true;
    }

    public List<TaskDTO> getTasksByStatus(String status) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase().replace('-', '_'));
        return taskRepository.findByStatus(taskStatus).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskDTO updateTaskStatus(UUID id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Convert string status to enum (handling hyphen in "in-progress")
        Task.TaskStatus taskStatus;
        try {
            taskStatus = Task.TaskStatus.valueOf(status.toUpperCase().replace('-', '_'));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid task status: " + status);
        }

        // Update status
        task.setStatus(taskStatus);

        // Save and convert back to DTO
        Task savedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(savedTask);
    }
}