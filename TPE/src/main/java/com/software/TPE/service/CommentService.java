package com.software.TPE.service;

import com.software.TPE.dto.CommentRequest;
import com.software.TPE.dto.CommentResponse;
import com.software.TPE.exception.BadRequestException;
import com.software.TPE.exception.ResourceNotFoundException;
import com.software.TPE.model.Comment;
import com.software.TPE.repository.CommentRepository;
import com.software.TPE.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentResponse create(CommentRequest request) {
        if (request.content().isBlank()) {
            throw new BadRequestException("El comentario no puede estar vacío");
        }

        postRepository.findById(request.postId())
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrada"));

        Comment comment = Comment.builder()
                .id(UUID.randomUUID().toString())
                .postId(request.postId())
                .userId(request.userId())
                .userName(request.userName())
                .content(request.content().trim())
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(commentRepository.save(comment));
    }

    public List<CommentResponse> findAll() {
        return commentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<CommentResponse> findByPost(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void delete(String commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResourceNotFoundException("Comentario no encontrado");
        }
        commentRepository.deleteById(commentId);
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getPostId(),
                comment.getUserId(),
                comment.getUserName(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
