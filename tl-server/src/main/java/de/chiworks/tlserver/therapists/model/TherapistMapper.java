package de.chiworks.tlserver.therapists.model;

import org.mapstruct.Mapper;

import de.chiworks.tlserver.security.model.entities.user.User;
import de.chiworks.tlserver.therapists.model.entities.Therapist;
import de.chiworks.tlserver.therapists.rest.TherapistCardTs;
import de.chiworks.tlserver.therapists.rest.TherapistTs;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

@Mapper(componentModel = "spring")
public interface TherapistMapper {
    /**
     * Maps a Therapist entity to a TherapistTs (Therapist Transfer Object).
     *
     * @param therapist the Therapist entity to map
     * @return the mapped TherapistTs object
     */
    @Nonnull
    TherapistTs toTherapistTs(@Nullable Therapist therapist);

    /**
     * Maps a TherapistTs (Therapist Transfer Object) to a Therapist entity.
     *
     * @param therapistTs the TherapistTs object to map
     * @param user        the User associated with the Therapist
     * @return the mapped Therapist entity
     */
    @Nonnull
    Therapist toTherapist(@Nullable TherapistTs therapistTs, @Nullable User user);

    /**
     * Maps a Therapist entity to a TherapistCardTs (Therapist Card Transfer Object).
     *
     * @param therapist the Therapist entity to map
     * @return the mapped TherapistCardTs object
     */
    @Nonnull
    TherapistCardTs toTherapistCardTs(@Nullable Therapist therapist);
}
