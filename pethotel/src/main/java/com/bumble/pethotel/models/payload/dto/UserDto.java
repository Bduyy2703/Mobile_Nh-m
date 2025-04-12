package com.bumble.pethotel.models.payload.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private LocalDate dob;
    private String address;
    private String gender;
    private String phone;
    private String username;
    private Long roleId;
    private boolean isPremium;
}
