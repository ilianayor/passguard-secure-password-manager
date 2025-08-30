package com.secure.passguard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdatePasswordDto {
    private String title;
    private String url;
    private String username;
    private String password;
}
