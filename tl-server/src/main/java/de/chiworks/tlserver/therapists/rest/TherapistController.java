package de.chiworks.tlserver.therapists.rest;

import java.util.Collection;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.chiworks.tlserver.security.AuthService;
import de.chiworks.tlserver.security.JwtService;
import de.chiworks.tlserver.security.model.entities.user.User;
import de.chiworks.tlserver.therapists.model.TherapistMapper;
import de.chiworks.tlserver.therapists.model.entities.Therapist;
import de.chiworks.tlserver.therapists.model.entities.TherapistRepository;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/therapists")
@RequiredArgsConstructor
public class TherapistController {

    @Nonnull
    private final TherapistRepository therapistRepo;
    @Nonnull
    private final JwtService jwtService;
    @Nonnull
    private final TherapistMapper therapistMapper;
    @Nonnull
    private final AuthService authService;

    /**
     * Gets a collection of therapists associated with the authenticated user.
     *
     * @return a collection of
     */
    @Nonnull
    @GetMapping("/")
    @PreAuthorize("isAuthenticated()")
    public Collection<TherapistCardTs> getTherapists() {
        User user = authService.getUser();
        Collection<Therapist> therapists = therapistRepo.getTherapistsByUser(user);
        return therapists.stream()
                         .map(therapistMapper::toTherapistCardTs)
                         .toList();
    }

    /**
     * Creates a new therapist or updates an existing one.
     *
     * @param therapistTs the therapist transfer object to create or update
     * @return the created or updated therapist transfer object
     */
    @Nonnull
    @PutMapping("/")
    @PreAuthorize("isAuthenticated()")
    public TherapistTs putTherapist(@Nonnull @RequestBody TherapistTs therapistTs) {
        User user = authService.getUser();
        authorizeAccess(therapistTs, user);
        return saveTherapist(therapistTs, user);
    }

    /**
     * Retrieves a specific therapist by ID.
     *
     * @param id the ID of the therapist to retrieve
     * @return the therapist transfer object
     */
    @Nonnull
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public TherapistTs getTherapist(@PathVariable long id) {
        User user = authService.getUser();
        TherapistTs therapist = therapistMapper.toTherapistTs(findTherapist(id));
        authorizeAccess(therapist, user);
        return therapist;
    }

    @Nonnull
    private TherapistTs saveTherapist(@Nonnull TherapistTs therapistTs, @Nonnull User user) {
        Therapist therapist = therapistRepo.save(therapistMapper.toTherapist(therapistTs, user));
        return therapistMapper.toTherapistTs(therapist);
    }

    private void authorizeAccess(@Nonnull TherapistTs therapistTs, @Nonnull User user) {
        if (therapistTs.getId() != null) {
            Therapist existingTherapist = findTherapist(therapistTs.getId());
            if (!existingTherapist.getUser().equals(user)) {
                throw new AccessDeniedException("User not authorized to update this therapist");
            }
        }
    }

    @Nonnull
    private Therapist findTherapist(long id) {
        return therapistRepo.findById(id)
                            .orElseThrow(() -> new IllegalArgumentException("Therapist not found with ID: " + id));
    }

}
