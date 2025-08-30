package com.secure.passguard.service.impl;

import com.secure.passguard.service.TotpService;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.stereotype.Service;

@Service
public class TotpServiceImpl implements TotpService {

    private final GoogleAuthenticator googleAuthenticator;

    public TotpServiceImpl() {
        this.googleAuthenticator = new GoogleAuthenticator();
    }

    public TotpServiceImpl(GoogleAuthenticator googleAuthenticator) {
        this.googleAuthenticator = googleAuthenticator;
    }

    @Override
    public GoogleAuthenticatorKey generateSecret() {
        return googleAuthenticator.createCredentials();
    }

    @Override
    public String getQrCodeUrl(GoogleAuthenticatorKey secret, String username) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("PassGuard App", username, secret);
    }

    @Override
    public boolean verifyCode(String secret, int code) {
        return googleAuthenticator.authorize(secret, code);
    }
}
