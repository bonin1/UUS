package com.uus.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_name")  
    private String taskName;

    @Column(name = "scheduled_time") 
    private Date scheduledTime;

    @Column(name = "end_time")  
    private Date endTime;
}
