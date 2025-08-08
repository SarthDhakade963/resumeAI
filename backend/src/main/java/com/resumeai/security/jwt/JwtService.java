package com.resumeai.security.jwt;

import com.resumeai.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String jwtSecretKey;

    private Key secretKey;

    // It converts your String key into a cryptographic key used for signing JWTs.
    @PostConstruct
    public void init() {
    // Keys.hmacShaKeyFor() - to generate a cryptographic signing key from a byte array, which is used to sign your JWT tokens using the HMAC-SHA algorithm.
        this.secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
        // SECRET_KEY.getBytes() — converts your secret key string into a byte array
    }

    // generate token using User ID
    public String generateToken(@NotNull User user) {
        return Jwts.builder()
                .setSubject(user.getEmail()) // setSubject(username) → sets who this token is for.
                .claim("userId", user.getId()) // custom claims
                .setIssuedAt(new Date(System.currentTimeMillis())) // setIssuedAt(...) -> time at which token is issue
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // setExpiration(...) → after this time, token becomes invalid.
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact(); // compact() → builds the final token.
    }

    // JWT has "claims" like field inside the subject
    // claims are pieces of information that are encoded inside the token
    // "subject" is a standard claim that usually stores the username/email.
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("username", String.class));
    }

    // General method to extract any piece of info from JWT (expiration, subject, etc).
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims); // Applies the claimsResolver to extract the specific field you want
    }

    // Parses the JWT and returns all data inside the payload
    // If token is invalid, it will throw an exception.
    //Signing key is used to verify the signature.
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // This method:
    //  Checks if username inside the token matches the one passed in
    //  And that the token is not expired
    public boolean isTokenValid(String token, Long expectedUserId) {
        final Long extractedUserId = extractUserId(token);
        return extractedUserId.equals(expectedUserId) && !isTokenExpired(token);
    }

    // If the expiration time is before now, the token is expired.
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }


}
