package de.chiworks.tlserver.security;

import java.util.Date;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import de.chiworks.tlserver.security.model.entities.user.User;
import de.chiworks.tlserver.security.model.entities.user.UserRepository;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;

/**
 * Service responsible for generating and validating JWT tokens.
 * Injects configuration properties prefixed with "app.jwt".
 */
@Service
@RequiredArgsConstructor
public class JwtService {

    @Nonnull
    private final UserRepository userRepository;
    @Nonnull
    private final JwtProperties prop;

    /**
     * Generates a JWT token for the given UserDetails.
     *
     * @param userDetails the authenticated user
     * @return signed JWT token as String
     */
    @Nonnull
    public String generateAccessToken(@Nonnull UserDetails userDetails) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + prop.getExpiration());

        return Jwts.builder()
                   .setSubject(userDetails.getUsername()) // username in the token
                   .setIssuedAt(now)                      // issue time
                   .setExpiration(expiry)                 // expiration time
                   .addClaims(Map.of("authorities", userDetails.getAuthorities())) // user authorities
                   .signWith(Keys.hmacShaKeyFor(prop.getSecret().getBytes()), SignatureAlgorithm.HS256)
                   .compact();
    }

    /**
     * Generates a JWT refresh token for the given UserDetails.
     *
     * @param userDetails the authenticated user
     * @return signed JWT refresh token as String
     */
    @Nonnull
    public String generateRefreshToken(@Nonnull UserDetails userDetails) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + prop.getRefreshExpiration());

        return Jwts.builder()
                   .setSubject(userDetails.getUsername()) // username in the token
                   .setIssuedAt(now)                      // issue time
                   .setExpiration(expiry)                 // expiration time
                   .signWith(Keys.hmacShaKeyFor(prop.getSecret().getBytes()), SignatureAlgorithm.HS256)
                   .compact();
    }

    /**
     * Extracts the username from the provided JWT token.
     *
     * @param token the JWT token
     * @return the subject (username)
     */
    @Nonnull
    public String extractUsername(@Nonnull String token) {
        return getParser()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Checks whether the token is valid for the given user.
     *
     * @param token the JWT token
     * @return true if valid and not expired
     */
    public boolean isTokenValid(@Nonnull String token, @Nonnull User user) {
        return isTokenSigned(token) && !isTokenExpired(token) && !isTokenRevoked(token, user);
    }

    /**
     * Checks if the token is revoked for the given user.
     * A token is considered revoked if it is not present in the user's list of tokens.
     *
     * @param token the JWT token
     * @param user  the user to check against
     * @return true if the token is revoked
     */
    public boolean isTokenRevoked(@Nonnull String token, @Nonnull User user) {
        return user.getTokens().stream()
                   .noneMatch(t -> t.equals(token));
    }

    public void revokeToken(@Nonnull String token, @Nonnull User user) {
        user.getTokens().removeIf(t -> t.equals(token));
        user.getTokens().removeIf(t -> !isTokenValid(t, user));
        userRepository.save(user);
    }

    /**
     * Checks if the JWT token is signed with the correct secret.
     *
     * @param token the JWT token
     * @return true if the token is signed
     */
    private boolean isTokenSigned(@Nonnull String token) {
        return getParser().isSigned(token);
    }

    /**
     * Checks if the JWT token is expired.
     *
     * @param token the JWT token
     * @return true if expired
     */
    private boolean isTokenExpired(@Nonnull String token) {
        try {
            getParser().parseClaimsJws(token);
            return false; // If parsing succeeds, token is not expired
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return true; // If an ExpiredJwtException is thrown, token is expired
        }
    }

    @Nonnull
    private JwtParser getParser() {
        return Jwts.parserBuilder()
                   .setSigningKey(prop.getSecret().getBytes())
                   .build();
    }
}
