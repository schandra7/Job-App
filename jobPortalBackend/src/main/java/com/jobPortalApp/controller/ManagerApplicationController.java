package com.jobPortalApp.controller;

import com.jobPortalApp.model.Application;
import com.jobPortalApp.service.ManagerApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/manager/applications")
public class ManagerApplicationController {

    private final ManagerApplicationService managerService;



    @GetMapping("/pending")
    public ResponseEntity<List<Application>> listPending() {
        return ResponseEntity.ok(managerService.listPending());
    }

    @GetMapping
    public ResponseEntity<List<Application>> listByDecision(
            @RequestParam Application.Decision decision
    ) {
        return ResponseEntity.ok(managerService.listByDecision(decision));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Application> approve(
            @PathVariable Long id,
            @RequestParam Long managerId,
            @RequestParam(required = false) String note
    ) {
        return ResponseEntity.ok(managerService.approve(id, managerId, note));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Application> reject(
            @PathVariable Long id,
            @RequestParam Long managerId,
            @RequestParam(required = false) String note
    ) {
        return ResponseEntity.ok(managerService.reject(id, managerId, note));
    }

    @PostMapping("/{id}/hold")
    public ResponseEntity<Application> hold(
            @PathVariable Long id,
            @RequestParam Long managerId,
            @RequestParam(required = false) String note
    ) {
        return ResponseEntity.ok(managerService.hold(id, managerId, note));
    }

    @PostMapping("/{id}/pending")
    public ResponseEntity<Application> pending(
            @PathVariable Long id,
            @RequestParam Long managerId,
            @RequestParam(required = false) String note
    ) {
        return ResponseEntity.ok(managerService.markPending(id, managerId, note));
    }
}
