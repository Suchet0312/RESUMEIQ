package com.mineapp.hello.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userEmail;
    private String fileUrl;
    private Integer score;
    private Boolean atsFriendly;

    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
    public String getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Boolean getAtsFriendly() { return atsFriendly; }
    public void setAtsFriendly(Boolean atsFriendly) { this.atsFriendly = atsFriendly; }
}
