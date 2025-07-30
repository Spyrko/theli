package de.chiworks.tlserver.security.model.entities.user;

import static de.chiworks.tlserver.security.model.Role.ADMIN;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;

/**
 * Initializes the database with a default admin user if none exists.
 */
@Component
@RequiredArgsConstructor
public class UserInitializer implements CommandLineRunner {

    @Nonnull
    private final UserRepository userRepository;
    @Nonnull
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if an admin user already exists
        boolean adminExists = userRepository.findByUsername("admin").isPresent();

        if (!adminExists) {
            // Create default admin user
            User admin = User.builder()
                             .username("admin")
                             .password(passwordEncoder.encode("admin"))
                             .role(ADMIN)
                             .build();

            userRepository.save(admin);
            System.out.println("✅ Default admin user created: username=admin, password=admin");
        } else {
            System.out.println("ℹ️ Admin user already exists. Skipping creation.");
        }
    }
}
