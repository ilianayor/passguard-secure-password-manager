package com.secure.passguard.controller;

import com.secure.passguard.exception.EmailAlreadyExistsException;
import com.secure.passguard.exception.RoleNotFoundException;
import com.secure.passguard.exception.UsernameAlreadyExistsException;
import com.secure.passguard.model.AppRole;
import com.secure.passguard.model.Role;
import com.secure.passguard.model.User;
import com.secure.passguard.model.SignUpMethod;
import com.secure.passguard.repository.RoleRepository;
import com.secure.passguard.repository.UserRepository;
import com.secure.passguard.security.jwt.JwtUtils;
import com.secure.passguard.security.request.LoginRequest;
import com.secure.passguard.security.request.SignupRequest;
import com.secure.passguard.security.response.LoginResponse;
import com.secure.passguard.security.response.MessageResponse;
import com.secure.passguard.security.response.UserDetailsResponse;
import com.secure.passguard.security.service.LoginAttemptService;
import com.secure.passguard.security.service.UserDetailsImpl;
import com.secure.passguard.service.TotpService;
import com.secure.passguard.service.UserService;
import com.secure.passguard.util.AuthUtil;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserService userService;

    @Autowired
    AuthUtil authUtil;

    @Autowired
    TotpService totpService;

    @Autowired
    LoginAttemptService loginAttemptService;

    @PostMapping("/public/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();

        if (loginAttemptService.isBlocked(username)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of(
                    "Message", "Account temporarily locked due to too many failed attempts. Try again after 15 minutes.",
                    "Status", false
                ));
        }

        Authentication authentication;
        try {
            authentication = authenticationManager
                .authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            loginAttemptService.loginFailed(username);

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "Message", "Bad credentials",
                    "Status", false
                ));
        }

        loginAttemptService.loginSucceeded(username);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        LoginResponse response = new LoginResponse(userDetails.getUsername(), roles, jwtToken);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/public/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new UsernameAlreadyExistsException("Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already in use!");
        }

        User user = new User(signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            passwordEncoder.encode(signUpRequest.getPassword()));

        user.setEnabled(true);
        user.setTwoFactorEnabled(false);
        user.setSignUpMethod(SignUpMethod.EMAIL);

        Role role = roleRepository.findByRoleName(AppRole.ROLE_USER)
            .orElseThrow(() -> new RoleNotFoundException("Role is not found!"));
        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        UserDetailsResponse response = new UserDetailsResponse(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.isEnabled(),
            user.isTwoFactorEnabled(),
            roles
        );

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/username")
    public String getUsername(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());

        return user.getUsername();
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal UserDetails userDetails, String newPassword) {
        User user = userService.findByUsername(userDetails.getUsername());
        userService.updatePassword(user.getUserId(), newPassword);

        return ResponseEntity.ok(new MessageResponse("Password updated"));
    }

    @PostMapping("/public/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        userService.generatePasswordResetToken(email);
        return ResponseEntity.ok(new MessageResponse("Password reset email sent successfully"));
    }

    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok(new MessageResponse("Password reset successful!"));
    }

    @PostMapping("/enable-mfa")
    public ResponseEntity<String> enableMfa() {
        Long userId = authUtil.loggedUserGetId();
        GoogleAuthenticatorKey secret = userService.generateMfaSecret(userId);

        String qrCodeUrl = totpService.getQrCodeUrl(secret,
            userService.getUserById(userId).getUsername());

        return ResponseEntity.ok(qrCodeUrl);
    }

    @PostMapping("/disable-mfa")
    public ResponseEntity<String> disableMfa() {
        Long userId = authUtil.loggedUserGetId();
        userService.disableMfa(userId);

        return ResponseEntity.ok("Multi-factor authentication disabled");
    }

    @PostMapping("/verify-mfa")
    public ResponseEntity<String> verifyMfa(@RequestParam int code) {
        Long userId = authUtil.loggedUserGetId();
        boolean isValid = userService.validateMfaCode(userId, code);

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid multi-factor authentication code");
        }

        userService.enableMfa(userId);
        return ResponseEntity.ok("Multi-factor authentication is verified");
    }

    @GetMapping("/user/mfa-status")
    public ResponseEntity<?> getMfaStatus() {
        User user = authUtil.loggedInUser();
        if (user != null) {
            return ResponseEntity.ok().body(Map.of("is2faEnabled", user.isTwoFactorEnabled()));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

    }

    @PostMapping("/public/verify-mfa-login")
    public ResponseEntity<String> verifyMfaLogin(@RequestParam int code,
                                                 @RequestParam String jwtToken) {
        String username = jwtUtils.getUsernameFromJwtToken(jwtToken);
        User user = userService.findByUsername(username);
        boolean isValid = userService.validateMfaCode(user.getUserId(), code);

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid multi-factor authentication code");
        }

        return ResponseEntity.ok("Multi-factor authentication verified");
    }

}
