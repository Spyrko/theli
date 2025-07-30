package de.chiworks.tlserver.therapists.model.entities;

import java.util.Date;

import de.chiworks.tlserver.therapists.model.ContactType;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * Represents a contact with a therapist.
 */
@Entity(name = "tl_contact")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {
    /**
     * Unique identifier for the contact.
     */
    @Id
    @Nullable
    @GeneratedValue
    private Long id;

    /**
     * Type of the contact (e.g., email, phone, etc.).
     */
    @Nonnull
    private ContactType type;

    /**
     * Content of the contact (e.g., message, email body, etc.).
     */
    @Nonnull
    private String content;

    /**
     * Date of the contact.
     */
    @Nonnull
    private Date date;
}
