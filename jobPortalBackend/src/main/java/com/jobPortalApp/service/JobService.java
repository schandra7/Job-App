package com.jobPortalApp.service;

import com.jobPortalApp.model.Job;

import java.util.List;

public interface JobService {

    Job create(Job job);

    Job update(Long id, Job payload);

    Job get(Long id);

    List<Job> list();                // Admin listing (all)

    List<Job> listPublished();       // Public/employee listing (only published)

    void deleteJob(Long id);         // Only when no applications exist

    void closeJob(Long id);          // Unpublish/close
}