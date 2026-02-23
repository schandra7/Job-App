package com.jobPortalApp.repository;

import com.jobPortalApp.model.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByJob_Id(Long jobId);
    long countByJob_Id(Long jobId);


    boolean existsByJob_IdAndUser_Id(Long jobId, Long userId);


    List<Application> findByUser_Id(Long userId);


    List<Application> findByDecisionAndStatus(Application.Decision decision, Application.Status status);

    Page<Application> findByDecisionAndStatus(Application.Decision decision, Application.Status status, Pageable pageable);
}