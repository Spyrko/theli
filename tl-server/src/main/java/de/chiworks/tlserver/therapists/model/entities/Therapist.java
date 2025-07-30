package de.chiworks.tlserver.therapists.model.entities;

import java.util.Date;
import java.util.List;
import java.util.Set;

import de.chiworks.tlserver.security.model.entities.user.User;
import de.chiworks.tlserver.therapists.model.RequestStatus;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Therapist entity representing a therapist in the system.
 */
@Entity(name = "tl_therapist")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Therapist {
    /**
     * Unique identifier for the therapist.
     */
    @Nullable
    @Id
    @GeneratedValue
    private Long id;

    /**
     * User associated with the therapist.
     */
    @Nonnull
    @ManyToOne
    private User user;

    /**
     * Status of the request to the therapist.
     */
    @Nonnull
    @Default
    private RequestStatus requestStatus = RequestStatus.NOT_REQUESTED;

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
     * Address the therapist.
     */
    @Nonnull
    private String address;

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
     * Waiting time for the therapist.
     */
    @Nullable
    private Date waitingTime;

    /**
     * Contact history with the therapist.
     */
    @Nonnull
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @Default
    private Set<Contact> contactHistory = Set.of();

    /**
     * Contact times of the therapist.
     */
    @Nonnull
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @Default
    private List<BusinessHours> contactTimes = List.of();

    /**
     * Notes about the therapist.
     */
    @Nullable
    private String notes;

    /**
     * Rating of the therapist.
     */
    @Nullable
    private Double rating;
}
