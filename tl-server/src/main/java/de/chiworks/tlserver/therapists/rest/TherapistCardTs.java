package de.chiworks.tlserver.therapists.rest;

import java.util.Date;
import java.util.List;

import de.chiworks.tlserver.therapists.model.RequestStatus;
import de.chiworks.tlserver.therapists.model.entities.BusinessHours;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TherapistCardTs {
    /**
     * Unique identifier for the therapist.
     */
    @Nullable
    private Long id;

    /**
     * Status of the request to the therapist.
     */
    @Nonnull
    private RequestStatus requestStatus;

    /**
     * Waiting time for the therapist.
     */
    @Nullable
    private Date waitingTime;

    /**
     * Name of the therapist.
     */
    @Nonnull
    private String name;

    /**
     * Specialization of the therapist.
     */
    @Nullable
    private String specialization;

    /**
     * Phone number of the therapist.
     */
    @Nullable
    private String phoneNumber;

    /**
     * Email address of the therapist.
     */
    @Nullable
    private String emailAddress;

    /**
     * Contact times of the therapist.
     */
    @Nullable
    @Default
    private List<BusinessHours> contactTimes = List.of();

    /**
     * Rating of the therapist.
     */
    @Nullable
    private Double rating;
}

