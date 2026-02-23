package com.jobPortalApp.service.serviceImpl;


import com.jobPortalApp.model.Application;
import com.jobPortalApp.repository.ApplicationRepository;
import com.jobPortalApp.service.ManagerApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ManagerApplicationServiceImpl implements ManagerApplicationService {

    private final ApplicationRepository appRepo;

    @Override
    public Application approve(Long applicationId, Long managerId, String note) {
        Application app = loadActive(applicationId);
        if (app.getDecision() == Application.Decision.APPROVED) {
            return app; // idempotent
        }
        setDecision(app, Application.Decision.APPROVED, managerId, note);
        return appRepo.save(app);
    }

    @Override
    public Application reject(Long applicationId, Long managerId, String note) {
        Application app = loadActive(applicationId);
        if (app.getDecision() == Application.Decision.REJECTED) {
            return app; // idempotent
        }
        setDecision(app, Application.Decision.REJECTED, managerId, note);
        return appRepo.save(app);
    }

    @Override
    public Application hold(Long applicationId, Long managerId, String note) {
        Application app = loadActive(applicationId);
        if (app.getDecision() == Application.Decision.ON_HOLD) {
            return app; // idempotent
        }
        setDecision(app, Application.Decision.ON_HOLD, managerId, note);
        return appRepo.save(app);
    }

    @Override
    public Application markPending(Long applicationId, Long managerId, String note) {
        Application app = loadActive(applicationId);
        if (app.getDecision() == Application.Decision.PENDING) {
            return app; // idempotent
        }
        setDecision(app, Application.Decision.PENDING, managerId, note);
        return appRepo.save(app);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Application> listPending() {
        return appRepo.findByDecisionAndStatus(
                Application.Decision.PENDING,
                Application.Status.APPLIED
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<Application> listByDecision(Application.Decision decision) {
        return appRepo.findByDecisionAndStatus(
                decision,
                Application.Status.APPLIED
        );
    }


    /**
     * Loads application and ensures it's eligible for manager action.
     * Rules:
     *  - must exist
     *  - must NOT be withdrawn by candidate
     */
    private Application loadActive(Long applicationId) {
        Application app = appRepo.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (app.getStatus() == Application.Status.WITHDRAWN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Application was withdrawn by the candidate");
        }
        return app;
    }

    /**
     * Mutates the given application with the new decision and audit info.
     */
    private void setDecision(Application app, Application.Decision decision, Long managerId, String note) {
        app.setDecision(decision);
        app.setManagerId(managerId);
        app.setReviewNote(note);
        app.setReviewedAt(LocalDateTime.now());
    }
}

