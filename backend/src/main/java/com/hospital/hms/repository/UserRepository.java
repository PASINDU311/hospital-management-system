package com.hospital.hms.repository;

import com.hospital.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Email එකෙන් User ව සෙවීම (Login සඳහා)
    Optional<User> findByEmail(String email);

    // Registration එකේදී Email එක කලින් පාවිච්චි කරලාදැයි බලන්න
    boolean existsByEmail(String email);
}