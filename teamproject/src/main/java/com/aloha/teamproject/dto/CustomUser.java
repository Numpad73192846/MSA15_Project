package com.aloha.teamproject.dto;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
<<<<<<< HEAD
public class CustomUser implements UserDetails {    
   
=======
public class CustomUser implements UserDetails {

>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
    private Users user;

    public CustomUser(Users user) {
        this.user = user;
    }

<<<<<<< HEAD
    /**
     * 권한 정보 메소드
     * UserDetails 를 CustomUser 로 구현
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthList()
                   .stream()
                   .map( (auth) -> new SimpleGrantedAuthority(auth.getAuth()) )
                   .collect(Collectors.toList());
=======
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthList()
            .stream()
            .map( (auth) -> new SimpleGrantedAuthority(auth.getAuth()))
            .collect(Collectors.toList());
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }
<<<<<<< HEAD

    @Override
=======
    
        @Override
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "ACTIVE".equals(user.getStatus());
    }
<<<<<<< HEAD

=======
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
}
