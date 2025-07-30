package de.chiworks.tlserver.security.model.entities.user;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import de.chiworks.tlserver.security.model.Role;
import de.chiworks.tlserver.security.rest.UserTs;
import jakarta.annotation.Nonnull;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User entity representing a user in the system.
 * Implements UserDetails for Spring Security integration.
 */
@Entity(name = "tl_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    @Nonnull
    private String username;
    @Nonnull
    private String password;
    @Nonnull
    private Role role;
    @Nonnull
    @Builder.Default
    Collection<String> tokens = new ArrayList<>();

    /**
     * Create new user from TS
     *
     * @param user TS, containing username and password
     * @param role role of the user
     * @return new User instance
     */
    @Nonnull
    public static User fromTS(@Nonnull UserTs user, @Nonnull Role role) {
        return new User(user.getUsername(), user.getPassword(), role, List.of());
    }

    /**
     * Get authorities of the user
     *
     * @return collection of granted authorities
     */
    @Override
    @Nonnull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }
}

