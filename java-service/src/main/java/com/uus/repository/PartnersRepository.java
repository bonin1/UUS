package com.uus.repository;

import com.uus.model.Partners;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PartnersRepository extends JpaRepository<Partners, Integer> {
    @Query("SELECT p.countries as country, COUNT(p) as count FROM Partners p GROUP BY p.countries")
    List<Object[]> countByCountries();

    @Query("SELECT p.countries as country, SUM(p.open_scolars) as total FROM Partners p GROUP BY p.countries")
    List<Object[]> sumScholarsByCountry();
}
