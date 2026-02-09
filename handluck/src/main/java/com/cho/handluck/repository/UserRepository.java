package com.cho.handluck.repository;

import com.cho.handluck.domain.AuthProvider;
import com.cho.handluck.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 사용자 Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 사용자 조회
     */
    Optional<User> findByEmail(String email);

    /**
     * 소셜 로그인 제공자와 제공자 ID로 사용자 조회
     */
    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(String email);
}
