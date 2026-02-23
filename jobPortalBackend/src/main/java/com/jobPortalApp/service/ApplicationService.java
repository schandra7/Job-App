package com.jobPortalApp.service;

import com.jobPortalApp.model.Application;

import java.util.List;

public interface ApplicationService {

    Application apply(Long jobId, Long userId);

    Application withdraw(Long applicationId, Long userId);

    List<Application> myApplications(Long userId);
}