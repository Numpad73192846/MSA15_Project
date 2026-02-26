package com.aloha.board.domain;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class Boards {
    private long no;
    private String id;
    private String title;
    private String writer;;
    private String createdAt;
    private String updatedAt;

    public Boards() {
        this.id = UUID.randomUUID().toString();
    }
}
