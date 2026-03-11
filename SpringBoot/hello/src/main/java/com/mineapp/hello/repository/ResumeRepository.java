package com.mineapp.hello.repository;

import com.mineapp.hello.model.Resume;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, String> {
    Optional<Resume> findTopByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Resume> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
