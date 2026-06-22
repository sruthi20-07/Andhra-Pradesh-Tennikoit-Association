package com.apta.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AptaPortalBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AptaPortalBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@aptamp.org")) {
				User admin = User.builder()
						.email("admin@aptamp.org")
						.passwordHash(passwordEncoder.encode("Admin@123"))
						.role("ADMIN")
						.firstName("System")
						.lastName("Admin")
						.district("Amaravati")
						.status("ACTIVE")
						.build();
				userRepository.save(admin);
				System.out.println("Default admin user created successfully: admin@aptamp.org");
			}
		};
	}
}
