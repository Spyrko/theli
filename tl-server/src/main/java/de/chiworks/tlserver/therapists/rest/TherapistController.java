package de.chiworks.tlserver.therapists.rest;

import static de.chiworks.tlserver.therapists.model.RequestStatus.WAITLISTED;
import static de.chiworks.tlserver.therapists.model.RequestStatus.WAITLIST_CLOSED_UNTIL;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.chiworks.tlserver.security.AuthService;
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
    @PreAuthorize("hasAuthority('CRUD_THERAPIST')")
    public Collection<TherapistCardTs> getTherapists() {
        User user = authService.getUser();
        Collection<Therapist> therapists = therapistRepo.getTherapistsByUser(user);
        return therapists.stream().map(therapistMapper::toTherapistCardTs).toList();
    }

    /**
     * Creates a new therapist or updates an existing one.
     *
     * @param therapistTs the therapist transfer object to create or update
     * @return the created or updated therapist transfer object
     */
    @Nonnull
    @PutMapping("/")
    @PreAuthorize("hasAuthority('CRUD_THERAPIST')")
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
    @PreAuthorize("hasAuthority('CRUD_THERAPIST')")
    public TherapistTs getTherapist(@PathVariable long id) {
        User user = authService.getUser();
        TherapistTs therapist = therapistMapper.toTherapistTs(findTherapist(id));
        authorizeAccess(therapist, user);
        return therapist;
    }

    @DeleteMapping("/")
    @PreAuthorize("hasAuthority('CRUD_THERAPIST')")
    public void deleteTherapists(@Nonnull @RequestParam List<Integer> ids) {
        User user = authService.getUser();
        ids.stream()
           .map((id) -> therapistMapper.toTherapistTs(findTherapist(id)))
           .peek((therapistTs) -> authorizeAccess(therapistTs, user))
           .map(TherapistTs::getId)
           .filter(Objects::nonNull)
           .forEach(therapistRepo::deleteById);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CRUD_THERAPIST')")
    public void deleteTherapist(@PathVariable long id) {
        User user = authService.getUser();
        TherapistTs therapistTs = therapistMapper.toTherapistTs(findTherapist(id));
        authorizeAccess(therapistTs, user);
        therapistRepo.deleteById(id);
    }

    @Nonnull
    private TherapistTs saveTherapist(@Nonnull TherapistTs therapistTs, @Nonnull User user) {
        cleanupTherapistTs(therapistTs);
        Therapist therapist = therapistRepo.save(therapistMapper.toTherapist(therapistTs, user));
        return therapistMapper.toTherapistTs(therapist);
    }

    private void cleanupTherapistTs(@Nonnull TherapistTs therapistTs) {
        if (therapistTs.getRequestStatus() != WAITLISTED && therapistTs.getRequestStatus() != WAITLIST_CLOSED_UNTIL) {
            therapistTs.setWaitingTime(null);
        }
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Auth: " + auth);
        System.out.println("Principal: " + auth.getPrincipal());
        System.out.println("Authorities: " + auth.getAuthorities());
        System.out.println("isAuthenticated: " + auth.isAuthenticated());
        return therapistRepo.findById(id).orElseThrow(() -> new AccessDeniedException("Therapist not found with ID: " + id));
    }

}
