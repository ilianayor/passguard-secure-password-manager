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

    @PostMapping("/public/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager
                .authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "Message", "Bad credentials",
                    "Status", false
                ));
        }

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

    @PostMapping("/enable-2fa")
    public ResponseEntity<String> enable2FA() {
        Long userId = authUtil.loggedUserGetId();
        GoogleAuthenticatorKey secret = userService.generate2FASecret(userId);

        String qrCodeUrl = totpService.getQrCodeUrl(secret,
            userService.getUserById(userId).getUsername());

        return ResponseEntity.ok(qrCodeUrl);
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<String> disable2FA() {
        Long userId = authUtil.loggedUserGetId();
        userService.disable2FA(userId);

        return ResponseEntity.ok("Two-factor authentication disabled");
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<String> verify2FA(@RequestParam int code) {
        Long userId = authUtil.loggedUserGetId();
        boolean isValid = userService.validate2FACode(userId, code);

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid two-factor authentication code");
        }

        userService.enable2FA(userId);
        return ResponseEntity.ok("Two-factor authentication is verified");
    }

    @GetMapping("/user/2fa-status")
    public ResponseEntity<?> get2FAStatus() {
        User user = authUtil.loggedInUser();
        if (user != null) {
            return ResponseEntity.ok().body(Map.of("is2faEnabled", user.isTwoFactorEnabled()));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

    }

    @PostMapping("/public/verify-2fa-login")
    public ResponseEntity<String> verify2FALogin(@RequestParam int code,
                                                 @RequestParam String jwtToken) {
        String username = jwtUtils.getUsernameFromJwtToken(jwtToken);
        User user = userService.findByUsername(username);
        boolean isValid = userService.validate2FACode(user.getUserId(), code);

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid two-factor authentication code");
        }

        return ResponseEntity.ok("Two-factor authentication verified");
    }

}
