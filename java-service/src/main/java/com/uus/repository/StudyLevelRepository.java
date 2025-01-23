package com.uus.repository;

import com.uus.model.StudyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudyLevelRepository extends JpaRepository<StudyLevel, Integer> {
    @Query("SELECT s.study_level as level, COUNT(s) as count FROM StudyLevel s GROUP BY s.study_level")
    List<Object[]> countByStudyLevel();
}
