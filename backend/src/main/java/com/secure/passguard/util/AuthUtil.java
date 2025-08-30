package com.secure.passguard.util;

import com.secure.passguard.exception.UserNotFoundException;
import com.secure.passguard.model.User;
import com.secure.passguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AuthUtil {
    private final UserRepository userRepository;

    public Long loggedUserGetId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        return user.getUserId();
    }

    public User loggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }


}
