package com.secure.passguard.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // disabling csrf checks
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()); // we want to authorize every request

        http.httpBasic(Customizer.withDefaults()); // basic authentication
        return http.build(); // we are returning the object using HTTP build
    }

    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();

        if (!manager.userExists("user1")) {
            manager.createUser(User.withUsername("user1")
                .password("{noop}password1")
                .roles("USER")
                .build());
        }

        if (!manager.userExists("admin")) {
            manager.createUser(User.withUsername("admin")
                .password("{noop}password2")
                .roles("ADMIN")
                .build());
        }
        return manager;
    }
}
