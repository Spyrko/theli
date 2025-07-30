package de.chiworks.tlserver.security.model;

import static de.chiworks.tlserver.security.model.Authority.ADD_USER;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;

import jakarta.annotation.Nonnull;

/**
 * Represents the roles available in the system.
 * Each role has a set of authorities associated with it.
 */
public enum Role {
    USER("USER"),
    ADMIN("ADMIN");

    @Nonnull
    private final String role;

    @Nonnull
    private final Map<String, Collection<Authority>> authoritiesMap = Map.of(
            "USER", List.of(),
            "ADMIN", List.of(ADD_USER)
    );

    Role(@Nonnull String role) {
        this.role = role;
    }

    @Nonnull
    public String getRole() {
        return role;
    }

    @Nonnull
    @Override
    public String toString() {
        return role;
    }

    @Nonnull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authoritiesMap.getOrDefault(role, List.of());
    }
}