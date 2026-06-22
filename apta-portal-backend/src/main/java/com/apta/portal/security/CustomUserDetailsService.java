package com.apta.portal.security;

import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        String dbRole = user.getRole();
        String mainRole = dbRole.startsWith("ROLE_") ? dbRole : "ROLE_" + dbRole;

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(mainRole));

        if (dbRole.equalsIgnoreCase("SUPER_ADMIN") || 
            dbRole.equalsIgnoreCase("DISTRICT_ADMIN") || 
            dbRole.equalsIgnoreCase("STATE_ADMIN") || 
            dbRole.equalsIgnoreCase("ADMIN") ||
            dbRole.equalsIgnoreCase("ROLE_SUPER_ADMIN") || 
            dbRole.equalsIgnoreCase("ROLE_DISTRICT_ADMIN") || 
            dbRole.equalsIgnoreCase("ROLE_STATE_ADMIN") || 
            dbRole.equalsIgnoreCase("ROLE_ADMIN")) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                authorities
        );
    }
}
