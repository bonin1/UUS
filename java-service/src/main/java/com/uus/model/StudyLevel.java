package com.uus.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "study_level")
public class StudyLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer study_level_id;

    @Column(name = "study_level", nullable = false, length = 50)
    private String study_level;

    @Override
    public String toString() {
        return study_level;
    }
}
