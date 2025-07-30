package de.chiworks.tlserver.therapists.model.entities;

import java.time.OffsetDateTime;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the business hours of a therapist.
 * This entity defines the opening and closing times for each day of the week.
 */
@Entity(name = "tl_business_hours")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessHours {
    /**
     * Unique identifier for the business hours' entry.
     */
    @Id
    @Nullable
    @GeneratedValue
    private Long id;

    /**
     * Day of the week for which these business hours apply.
     */
    @Nonnull
    private String dayOfWeek;

    /**
     * Opening time for the therapist on the specified day.
     */
    @Nonnull
    private OffsetDateTime openingTime;

    /**
     * Closing time for the therapist on the specified day.
     */
    @Nonnull
    private OffsetDateTime closingTime;
}
