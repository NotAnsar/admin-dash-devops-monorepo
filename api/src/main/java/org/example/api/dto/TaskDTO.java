package org.example.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.api.model.Task;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private ZonedDateTime createdAt;

    public static TaskDTO fromEntity(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus().name().toLowerCase().replace('_', '-'));
        dto.setPriority(task.getPriority().name().toLowerCase());
        dto.setCreatedAt(task.getCreatedAt());
        return dto;
    }

    public Task toEntity() {
        Task task = new Task();
        task.setId(this.id);
        task.setTitle(this.title);
        task.setDescription(this.description);
        task.setStatus(Task.TaskStatus.valueOf(this.status.toUpperCase().replace('-', '_')));
        task.setPriority(Task.TaskPriority.valueOf(this.priority.toUpperCase()));
        task.setCreatedAt(this.createdAt != null ? this.createdAt : ZonedDateTime.now());
        return task;
    }
}