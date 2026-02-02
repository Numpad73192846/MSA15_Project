<<<<<<< HEAD
package com.aloha.teamproject.dto;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TutorAvailability {

    @JsonIgnore
    private Long no;
    @JsonIgnore
    private String userId;
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    @Builder.Default
    private Status status = Status.OPEN;
    @JsonIgnore
    private Date createdAt;
    @JsonIgnore
    private Date updatedAt;

    public TutorAvailability() {
        this.id = UUID.randomUUID().toString();
        this.status = Status.OPEN;
    }

    public enum Status {
        OPEN, BOOKED, CANCELLED
    }
}
=======
package com.aloha.teamproject.dto;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TutorAvailability {

    @JsonIgnore
    private Long no;
    @JsonIgnore
    private String userId;
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    @Builder.Default
    private Status status = Status.OPEN;
    @JsonIgnore
    private Date createdAt;
    @JsonIgnore
    private Date updatedAt;

    public TutorAvailability() {
        this.id = UUID.randomUUID().toString();
        this.status = Status.OPEN;
    }

    public enum Status {
        OPEN, BOOKED, CANCELLED
    }
}
>>>>>>> origin/cheshire
