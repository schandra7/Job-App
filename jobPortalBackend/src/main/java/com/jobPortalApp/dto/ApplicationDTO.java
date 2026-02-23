package com.jobPortalApp.dto;

import com.jobPortalApp.model.Application;

public record ApplicationDTO(
        Long id,
        Long jobId,
        Long userId,
        String status,
        String decision,
        String appliedAt,
        String updatedAt,
        String reviewNote
) {
    public static ApplicationDTO from(Application a) {
        return new ApplicationDTO(
                a.getId(),
                a.getJob().getId(),
                a.getUser().getId(),
                a.getStatus().name(),
                a.getDecision().name(),
                a.getAppliedAt() != null ? a.getAppliedAt().toString() : null,
                a.getUpdatedAt() != null ? a.getUpdatedAt().toString() : null,
                a.getReviewNote()
        );
    }
}
