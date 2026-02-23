package com.jobPortalApp.repository;

import com.jobPortalApp.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    // For public/employee listing
    List<Job> findByIsPublishedTrue();
}
