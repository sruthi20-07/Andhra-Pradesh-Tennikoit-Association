package com.apta.portal.registration.dto;

import jakarta.validation.constraints.NotNull;

public class TournamentRegistrationRequest {

    @NotNull(message = "Tournament ID is required")
    private Long tournamentId;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    public TournamentRegistrationRequest() {
    }

    public TournamentRegistrationRequest(Long tournamentId, Long categoryId) {
        this.tournamentId = tournamentId;
        this.categoryId = categoryId;
    }

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
