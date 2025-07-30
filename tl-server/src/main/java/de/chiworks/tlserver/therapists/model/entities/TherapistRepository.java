package de.chiworks.tlserver.therapists.model.entities;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.chiworks.tlserver.security.model.entities.user.User;
import jakarta.annotation.Nonnull;

/**
 * Repository for managing Therapist entities.
 * This class contains methods to interact with the database for Therapist entities.
 */
@Repository
public interface TherapistRepository extends JpaRepository<Therapist, Long> {

    /**
     * Finds all therapists for a given user.
     * @param user the user for whom to find therapists
     * @return a collection of therapists associated with the user
     */
    @Nonnull Collection<Therapist> getTherapistsByUser(@Nonnull User user);
}
