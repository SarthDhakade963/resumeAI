package com.resumeai.config;
import com.resumeai.model.User;
import com.resumeai.security.JwtFilter;
import com.resumeai.security.JwtUtil;
import com.resumeai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${next.auth.secret}")
    private String nextAuthSecret;

    private final JwtFilter jwtFilter;

    private final UserService userService;

    private final JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> {}) // enables cors
                .csrf(AbstractHttpConfigurer::disable) // disable csrf
                .authorizeHttpRequests(
                        auth -> auth
                                        .requestMatchers("/auth/**","/login**", "/oauth2/**").permitAll()
                                        .requestMatchers("/user/**").authenticated()
                                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(oAuth2UserService())
                        )
                        .successHandler(oAuth2SuccessHandler())
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(List.of("PUT", "POST", "GET", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true); // Important if using cookies

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

        return request -> {
            OAuth2User user = delegate.loadUser(request);
            String registrationId = request.getClientRegistration().getRegistrationId();

            if ("linkedin".equals(registrationId)) {
                String accessToken = request.getAccessToken().getTokenValue();
                String email = fetchLinkedInEmail(accessToken);

                Map<String, Object> attributes = new HashMap<>(user.getAttributes());
                attributes.put("email", email);

                return new DefaultOAuth2User(
                        user.getAuthorities(),
                        attributes,
                        "id"
                );
            }

            return user;
        };
    }

    private String fetchLinkedInEmail(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("X-Restli-Protocol-Version", "2.0.0");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                HttpMethod.GET,
                entity,
                Map.class
        );

        List<Map<String, Object>> elements = (List<Map<String, Object>>) response.getBody().get("elements");
        if (!elements.isEmpty()) {
            Map<String, Object> handle = (Map<String, Object>) elements.get(0).get("handle~");
            return (String) handle.get("emailAddress");
        }
        return null;
    }

    @Bean
    public AuthenticationSuccessHandler oAuth2SuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2User oAuthUser = (OAuth2User) authentication.getPrincipal();
            String email = (String) oAuthUser.getAttributes().get("email");

            // Get or create user
            User user = userService.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername((String) oAuthUser.getAttributes().get("localizedFirstName"));
                newUser.setProfilePicUrl(null); // you could fetch image from LinkedIn API
                newUser.setAuthProfileComplete(false);
                userService.save(newUser);
                return newUser;
            });

            // Issue JWT
            String jwt = jwtUtil.generateToken(user.getId(), user.getEmail());

            // Redirect to frontend with JWT
            response.sendRedirect(frontendUrl + "/oauth-success?token=" + jwt);
        };
    }
}