package com.uus.service;

import com.uus.model.Task;
import com.uus.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public Task findById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setTaskName(updatedTask.getTaskName());
                task.setScheduledTime(updatedTask.getScheduledTime());
                task.setEndTime(updatedTask.getEndTime());
                return taskRepository.save(task);
            })
            .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }
}
