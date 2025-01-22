package com.uus.controller;

import com.uus.model.Task;
import com.uus.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.text.ParseException;
import java.util.Date;
import java.util.Map;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:8080")
public class TaskController {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    
    @Autowired
    private TaskService taskService;

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        try {
            Task task = taskService.findById(id);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/update")
    @ResponseBody
    public ResponseEntity<?> updateTask(
            @PathVariable Long id,
            @RequestParam(required = true) String taskName,
            @RequestParam(required = true) String scheduledTime,
            @RequestParam(required = true) Integer duration) {
        

        try {
            Task existingTask = taskService.findById(id);
            if (existingTask == null) {
                return ResponseEntity.notFound().build();
            }

            existingTask.setTaskName(taskName);

            try {
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
                Date scheduled = formatter.parse(scheduledTime);
                existingTask.setScheduledTime(scheduled);

                Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
                calendar.setTime(scheduled);
                calendar.add(Calendar.DATE, duration);
                existingTask.setEndTime(calendar.getTime());

                Task updated = taskService.updateTask(id, existingTask);
                return ResponseEntity.ok(updated);

            } catch (ParseException e) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Date must be in ISO format with timezone"));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
