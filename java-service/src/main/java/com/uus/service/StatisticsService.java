package com.uus.service;

import com.uus.dto.StatisticsDTO;
import com.uus.repository.PartnersRepository;
import com.uus.repository.StudyLevelRepository;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticsService {
    private final PartnersRepository partnersRepository;
    private final StudyLevelRepository studyLevelRepository;

    public StatisticsService(PartnersRepository partnersRepository,
                           StudyLevelRepository studyLevelRepository) {
        this.partnersRepository = partnersRepository;
        this.studyLevelRepository = studyLevelRepository;
    }

    public StatisticsDTO getStatistics() {
        var partners = partnersRepository.findAll();
        
        Map<String, Long> byLevel = partners.stream()
            .collect(Collectors.groupingBy(
                p -> p.getLevel().name(),
                Collectors.counting()));

        Map<String, Long> bySemester = partners.stream()
            .collect(Collectors.groupingBy(
                p -> p.getSemester().name(),
                Collectors.counting()));

        Map<String, Long> byCountry = partnersRepository.countByCountries().stream()
            .collect(Collectors.toMap(
                arr -> (String) arr[0],
                arr -> (Long) arr[1]
            ));

        Map<String, Integer> scholarsByCountry = partnersRepository.sumScholarsByCountry().stream()
            .collect(Collectors.toMap(
                arr -> (String) arr[0],
                arr -> ((Number) arr[1]).intValue()
            ));


        // Add study level statistics
        Map<String, Long> studyLevelStats = studyLevelRepository.countByStudyLevel().stream()
            .collect(Collectors.toMap(
                arr -> (String) arr[0],
                arr -> (Long) arr[1]
            ));

        return StatisticsDTO.builder()
            .totalPartners(partnersRepository.count())
            .partnersByLevel(byLevel)
            .partnersBySemester(bySemester)
            .partnersByCountry(byCountry)
            .openScholarsByCountry(scholarsByCountry)
            .totalStudyLevels(studyLevelRepository.count())
            .studyLevelDistribution(studyLevelStats)
            .build();
    }
}
