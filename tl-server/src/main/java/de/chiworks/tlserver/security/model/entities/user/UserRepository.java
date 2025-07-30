package de.chiworks.tlserver.security.model.entities.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.annotation.Nonnull;

/**
 * Repository for managing User entities.
 * This interface extends JpaRepository to provide CRUD operations for User entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    /**
     * Finds a user by their username.
     * @param username the username of the user to find
     * @return an Optional containing the User if found, or empty if not found
     */
    @Nonnull
    Optional<User> findByUsername(@Nonnull String username);
}