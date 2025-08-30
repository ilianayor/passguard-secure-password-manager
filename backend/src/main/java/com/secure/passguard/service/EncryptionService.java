package com.secure.passguard.service;

public interface EncryptionService {

    String encrypt(String plainText);

    String decrypt(String cipherText);
}
