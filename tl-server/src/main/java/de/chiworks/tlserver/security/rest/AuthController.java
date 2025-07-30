package de.chiworks.tlserver.security.rest;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.chiworks.tlserver.security.AuthService;
import de.chiworks.tlserver.security.JwtService;
import de.chiworks.tlserver.security.model.Role;
import de.chiworks.tlserver.security.model.entities.user.User;
import de.chiworks.tlserver.security.model.entities.user.UserRepository;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    @Nonnull
    private final UserRepository userRepo;
    @Nonnull
    private final PasswordEncoder encoder;
    @Nonnull
    private final JwtService jwtService;
    @Nonnull
    private final AuthService authService;

    /**
     * Registers a new user.
     * This method takes a UserTS object, encodes the password, and saves the user
     *
     * @param user the user to register
     * @return ResponseEntity with the saved user or an error message
     */
    @Nonnull
    @PostMapping("/register")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> register(@Nonnull @RequestBody UserTs user) {
        user.setPassword(encoder.encode(user.getPassword()));
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }
        return ResponseEntity.ok(userRepo.save(User.fromTS(user, Role.USER)));
    }

    /**
     * Logs in a user.
     * This method checks the provided username and password, and if valid, returns a success message.
     *
     * @param payload a map containing "username" and "password"
     * @return ResponseEntity with a success message or an error message
     */
    @Nonnull
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> login(@Nonnull @RequestBody Map<String, String> payload) {
        // TODO: brute force protection
        var user = userRepo.findByUsername(payload.get("username"))
                           .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!encoder.matches(payload.get("password"), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        return ResponseEntity.ok(generateNewTokens(user));
    }

    /**
     * Refreshes the JWT token.
     * This method checks if the provided refresh token is valid and generates a new token pair if it is.
     * The refresh token is revoked after use to prevent reuse.
     *
     * @param token the JWT token to refresh
     * @return ResponseEntity with the new tokens or an error message
     */
    @Nonnull
    @PostMapping("/refresh")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> refresh(@Nonnull @RequestBody String token) {
        var user = userRepo.findByUsername(jwtService.extractUsername(token))
                           .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!jwtService.isTokenValid(token, user)) {
            return ResponseEntity.status(401).body("Invalid token");
        }
        revokeTokens(token, user);

        return ResponseEntity.ok(generateNewTokens(user));
    }

    private AuthResponseTs generateNewTokens(@Nonnull User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        user.getTokens().add(refreshToken);
        user.getTokens().add(accessToken);
        userRepo.save(user);
        return new AuthResponseTs(accessToken, refreshToken);
    }

    private void revokeTokens(@Nonnull String refreshToken, @Nonnull User user) {
        String accessToken = authService.getAccessToken();
        if (accessToken != null) {
            jwtService.revokeToken(accessToken, user);
        }
        jwtService.revokeToken(refreshToken, user);
    }

    /**
     * Logs out a user by revoking the provided JWT tokens.
     *
     * @param token the JWT refresh token to revoke
     */
    @PostMapping("/logout")
    @PreAuthorize("permitAll()")
    public void logout(@Nonnull @RequestBody String token) {
        var user = userRepo.findByUsername(jwtService.extractUsername(token))
                           .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        revokeTokens(token, user);
    }
}
