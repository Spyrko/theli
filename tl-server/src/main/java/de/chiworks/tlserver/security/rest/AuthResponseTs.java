package de.chiworks.tlserver.security.rest;

import jakarta.annotation.Nonnull;
import lombok.Data;

/**
 * Represents the response for authentication containing a token.
 */
@Data
public class AuthResponseTs {

    /**
     * The authentication token.
     * This token is used to authenticate subsequent requests.
     */
    @Nonnull
    private String accessToken;

    /**
     * The refresh token.
     * This token is used to refresh the access token when it expires.
     */
    @Nonnull
    private String refreshToken;
}
