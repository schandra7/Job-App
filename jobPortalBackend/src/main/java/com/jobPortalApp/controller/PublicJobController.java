package com.jobPortalApp.controller;

import com.jobPortalApp.model.Job;
import com.jobPortalApp.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jobs")
public class PublicJobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> listPublished() {
        return ResponseEntity.ok(jobService.listPublished());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getIfPublished(@PathVariable Long id) {
        Job job = jobService.get(id);
        if (Boolean.FALSE.equals(job.getIsPublished())) {
            // Hide unpublished jobs from public endpoints
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(job);
    }
}