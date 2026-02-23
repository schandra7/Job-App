package com.jobPortalApp.service;

import com.jobPortalApp.model.Application;

import java.util.List;

public interface ManagerApplicationService {

    Application approve(Long applicationId, Long managerId, String note);

    Application reject(Long applicationId, Long managerId, String note);

    Application hold(Long applicationId, Long managerId, String note);

    Application markPending(Long applicationId, Long managerId, String note);

    List<Application> listPending();

    List<Application> listByDecision(Application.Decision decision);
}