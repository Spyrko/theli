package de.chiworks.tlserver.security.model;

import org.springframework.security.core.GrantedAuthority;

import jakarta.annotation.Nonnull;

/**
 * Represents the authorities granted to a user in the system.
 * Implements GrantedAuthority to be used in Spring Security.
 */
public enum Authority implements GrantedAuthority {
    NOOP("NOOP"),
    CRUD_THERAPIST("CRUD_THERAPIST");

    @Nonnull
    private final String authority;

    Authority(@Nonnull String authority) {
        this.authority = authority;
    }

    @Override
    @Nonnull
    public String getAuthority() {
        return authority;
    }

    @Override
    @Nonnull
    public String toString() {
        return authority;
    }
}
