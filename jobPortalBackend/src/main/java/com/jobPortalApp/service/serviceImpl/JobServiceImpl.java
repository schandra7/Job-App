package com.jobPortalApp.service.serviceImpl;

import com.jobPortalApp.model.Job;
import com.jobPortalApp.repository.ApplicationRepository;
import com.jobPortalApp.repository.JobRepository;
import com.jobPortalApp.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    public Job create(Job job) {
        // Ensure a default published state if null
        if (job.getIsPublished() == null) {
            job.setIsPublished(Boolean.TRUE);
        }
        return jobRepository.save(job);
    }

    @Override
    public Job update(Long id, Job payload) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        job.setTitle(payload.getTitle());
        job.setDescription(payload.getDescription());
        job.setLocation(payload.getLocation());
        job.setApplyDeadline(payload.getApplyDeadline());
        if (payload.getIsPublished() != null) {
            job.setIsPublished(payload.getIsPublished());
        }

        return jobRepository.save(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Job get(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> list() {
        return jobRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> listPublished() {
        return jobRepository.findByIsPublishedTrue();
    }

    @Override
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        // Block delete if applications exist
        if (applicationRepository.existsByJob_Id(id)) {
            long count = applicationRepository.countByJob_Id(id);
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete this job because " + count + " application(s) exist. Close/unpublish the job instead."
            );
        }

        jobRepository.delete(job);
    }

    @Override
    public void closeJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        // Idempotent close
        if (Boolean.FALSE.equals(job.getIsPublished())) {
            return; // already closed
        }
        job.setIsPublished(Boolean.FALSE);
        // save() is optional inside @Transactional (dirty checking will flush),
        // but it is explicit and safe:
        jobRepository.save(job);
    }
}