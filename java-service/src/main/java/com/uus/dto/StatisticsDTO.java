package com.uus.dto;

import lombok.Data;
import lombok.Builder;
import java.util.Map;

@Data
@Builder
public class StatisticsDTO {
    private long totalPartners;
    private Map<String, Long> partnersByLevel;
    private Map<String, Long> partnersBySemester;
    private Map<String, Long> partnersByCountry;
    private Map<String, Integer> openScholarsByCountry;
    private long totalStudyLevels;
    private Map<String, Long> studyLevelDistribution;
}
