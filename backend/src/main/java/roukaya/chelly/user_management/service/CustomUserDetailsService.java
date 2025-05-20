package roukaya.chelly.user_management.service;

import roukaya.chelly.user_management.model.Permission;
import roukaya.chelly.user_management.model.Role;
import roukaya.chelly.user_management.model.User;
import roukaya.chelly.user_management.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (!user.isActive()) {
            throw new UsernameNotFoundException("User is disabled");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isActive(),
                true,
                true,
                true,
                getAuthorities(user)
        );
    }

  private Collection<? extends GrantedAuthority> getAuthorities(User user) {
    List<GrantedAuthority> authorities = new ArrayList<>();
    
    System.out.println("Loading authorities for user: " + user.getEmail());
    
    // Add role authorities
    for (Role role : user.getRoles()) {
        String roleAuthority = "ROLE_" + role.getName();
        System.out.println("Adding role authority: " + roleAuthority);
        authorities.add(new SimpleGrantedAuthority(roleAuthority));
        
        // Add permission authorities
        for (Permission permission : role.getPermissions()) {
            System.out.println("Adding permission authority: " + permission.getName());
            authorities.add(new SimpleGrantedAuthority(permission.getName()));
        }
    }
    
    return authorities;
}
}