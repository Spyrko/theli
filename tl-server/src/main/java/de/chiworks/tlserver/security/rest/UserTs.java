package de.chiworks.tlserver.security.rest;

import jakarta.annotation.Nonnull;
import lombok.Data;

@Data
public class UserTs {
    @Nonnull
    private String username;
    @Nonnull
    private String password;
}
