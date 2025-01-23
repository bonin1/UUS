package com.uus.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Partners")
public class Partners {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255)
    private String name;

    @Column(length = 255)
    private String countries;

    @Column(name = "open_scolars")
    private Integer open_scolars;

    @Lob
    @Column(name = "partners_photos", columnDefinition = "LONGBLOB")
    private byte[] partners_photos;

    @Column(length = 8)
    @Enumerated(EnumType.STRING)
    private Level level;

    @Column(length = 6)
    @Enumerated(EnumType.STRING)
    private Season semester;

    @Column(name = "dep_id")
    private Integer dep_id;

    public enum Season {
        Winter, Summer
    }
    
    public enum Level {
        Bachelor, Master
    }
}
