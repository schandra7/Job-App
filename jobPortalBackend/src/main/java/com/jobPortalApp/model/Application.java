package com.jobPortalApp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Entity
@Table(
        name = "applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "user_id"})
)
@Getter @Setter
public class Application {

    public enum Status { APPLIED, WITHDRAWN }
    public enum Decision { PENDING, APPROVED, REJECTED, ON_HOLD }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.APPLIED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Decision decision = Decision.PENDING;

    @Column(name = "manager_id")
    private Long managerId; // manager who approved/rejected

    private String reviewNote;

    private LocalDateTime reviewedAt;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        appliedAt = LocalDateTime.now();
        updatedAt = appliedAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}