package com.software.TPE.controller;

import com.software.TPE.dto.CommentRequest;
import com.software.TPE.dto.CommentResponse;
import com.software.TPE.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> create(@Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> findAll(@RequestParam(required = false) String postId) {
        if (postId != null && !postId.isBlank()) {
            return ResponseEntity.ok(commentService.findByPost(postId));
        }
        return ResponseEntity.ok(commentService.findAll());
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable String commentId) {
        commentService.delete(commentId);
        return ResponseEntity.noContent().build();
    }
}
