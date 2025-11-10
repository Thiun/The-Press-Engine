package com.software.TPE.controller;

import com.software.TPE.dto.CreatePostRequest;
import com.software.TPE.dto.PostResponse;
import com.software.TPE.dto.ReviewPostRequest;
import com.software.TPE.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> create(@Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> findAll() {
        return ResponseEntity.ok(postService.findAll());
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<PostResponse>> findPending() {
        return ResponseEntity.ok(postService.findPending());
    }

    @GetMapping("/escritor/{authorId}")
    public ResponseEntity<List<PostResponse>> findByAuthor(@PathVariable String authorId) {
        return ResponseEntity.ok(postService.findByAuthor(authorId));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> findById(@PathVariable String postId) {
        return ResponseEntity.ok(postService.getById(postId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> review(@PathVariable String postId,
                                               @Valid @RequestBody ReviewPostRequest request) {
        return ResponseEntity.ok(postService.reviewPost(postId, request));
    }
}
