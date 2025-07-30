package de.chiworks.tlserver.security;

import static java.util.Optional.ofNullable;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import de.chiworks.tlserver.security.model.entities.user.User;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

@Service
public class AuthService {

    /**
     * Retrieves the currently authenticated user from the security context.
     *
     * @return the currently authenticated User
     * @throws ClassCastException if the principal in the security context is not of type User
     */
    @Nonnull
    public User getUser() {
        return (User) ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal)
                .orElseThrow(() -> new ClassCastException("No authenticated user found in security context"));
    }

    /**
     * Retrieves the access token from the security context.
     *
     * @return the access token as a String, or null if not available
     */
    @Nullable
    public String getAccessToken() {
        return (String) ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getCredentials)
                .orElse(null);
    }

    /**
     * Sets the authentication in the security context to the given user with the given token.
     *
     * @param token the authentication token
     * @param user  the authenticated user
     */
    public void setAuthentication(@Nonnull String token, @Nonnull User user) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user, token, user.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
