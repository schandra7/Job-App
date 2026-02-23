package com.jobPortalApp.controller;

import com.jobPortalApp.model.Job;
import com.jobPortalApp.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/jobs")
public class AdminJobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<Job> create(@RequestBody Job job) {
        Job created = jobService.create(job);
        return ResponseEntity.created(URI.create("/admin/jobs/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> update(@PathVariable Long id, @RequestBody Job payload) {
        Job updated = jobService.update(id, payload);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> get(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<Job>> list() {
        return ResponseEntity.ok(jobService.list());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<Void> close(@PathVariable Long id) {
        jobService.closeJob(id);
        return ResponseEntity.noContent().build();
    }
}