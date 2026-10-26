package com.gsc.bm.repo.external;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class UserCredentialsRecord {

    private String username;

    private String email;

    private String saltedHash;

    private String role;
}
