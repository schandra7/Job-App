package com.jobPortalApp.controller;

import com.jobPortalApp.model.Application;
import com.jobPortalApp.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    // Assume userId is derived from the authenticated principal in real apps.
    // For simplicity, it's accepted as request param/body here.

    @PostMapping("/apply")
    public ResponseEntity<Application> apply(
            @RequestParam Long jobId,
            @RequestParam Long userId
    ) {
        Application created = applicationService.apply(jobId, userId);
        return ResponseEntity.created(URI.create("/applications/" + created.getId())).body(created);
    }

    @PostMapping("/{applicationId}/withdraw")
    public ResponseEntity<Application> withdraw(
            @PathVariable Long applicationId,
            @RequestParam Long userId
    ) {
        Application updated = applicationService.withdraw(applicationId, userId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Application>> myApplications(@RequestParam Long userId) {
        return ResponseEntity.ok(applicationService.myApplications(userId));
    }
}