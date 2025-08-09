package de.chiworks.tlserver.therapists.model;

import jakarta.annotation.Nonnull;

/**
 * Represents the status of a request to a therapist.
 * This enum defines various states that a request can be in.
 */
public enum RequestStatus {
    NOT_REQUESTED("NOT_REQUESTED"),
    REQUESTED("REQUESTED"),
    ACCEPTED("ACCEPTED"),
    REJECTED("REJECTED"),
    WAITLISTED("WAITLISTED"),
    WAITLIST_CLOSED_UNTIL("WAITLIST_CLOSED_UNTIL"),
    NOT_INTERESTED("NOT_INTERESTED");

    @Nonnull
    final String status;

    RequestStatus(@Nonnull String status) {
        this.status = status;
    }

    @Override
    @Nonnull
    public String toString() {
        return status;
    }
}
