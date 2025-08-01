package de.chiworks.tlserver.security;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import de.chiworks.tlserver.security.model.entities.user.User;
import de.chiworks.tlserver.security.model.entities.user.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filter that intercepts each HTTP request to extract and validate a JWT token.
 * Sets the authentication context if the token is valid.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    @Nonnull
    private final JwtService jwtService;
    @Nonnull
    private final UserRepository userRepo;
    @Nonnull
    private final AuthService authService;

    /**
     * Intercepts the request, extracts the JWT token from Authorization header,
     * validates it, and sets the Spring Security context if valid.
     *
     * @param request     incoming HTTP request
     * @param response    outgoing HTTP response
     * @param filterChain chain of filters
     */
    @Override
    protected void doFilterInternal(@Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Get the Authorization header (if any)
            String authHeader = request.getHeader("Authorization");

            // Continue without processing if header is missing or malformed
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // Remove "Bearer " prefix to get the token
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            User user = userRepo.findByUsername(username).orElse(null);

            // Validate token and set authentication if valid
            if (user != null && jwtService.isTokenValid(token, user)) {
                authService.setAuthentication(token, user);
            }

            // Continue the filter chain
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            respondWithUnauthorized(response, "JWT token expired");
        } catch (JwtException ex) {
            respondWithUnauthorized(response, "Invalid JWT token");
        }
    }

    private void respondWithUnauthorized(@Nonnull HttpServletResponse response, @Nonnull String s) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + s + "\"}");
        response.getWriter().flush();
    }
}