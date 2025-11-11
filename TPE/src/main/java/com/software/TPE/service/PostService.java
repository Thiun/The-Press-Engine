package com.software.TPE.service;

import com.software.TPE.dto.CreatePostRequest;
import com.software.TPE.dto.PostResponse;
import com.software.TPE.dto.ReviewPostRequest;
import com.software.TPE.exception.BadRequestException;
import com.software.TPE.exception.ResourceNotFoundException;
import com.software.TPE.model.Post;
import com.software.TPE.model.PostStatus;
import com.software.TPE.model.User;
import com.software.TPE.model.UserStatus;
import com.software.TPE.repository.PostRepository;
import com.software.TPE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostResponse create(CreatePostRequest request) {
        User author = userRepository.findById(request.authorId())
                .orElseThrow(() -> new ResourceNotFoundException("Autor no encontrado"));

        if (author.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("El usuario no puede crear publicaciones en este momento");
        }

        Post post = Post.builder()
                .id(UUID.randomUUID().toString())
                .title(request.title())
                .content(request.content())
                .authorId(author.getId())
                .authorName(StringUtils.hasText(request.authorName()) ? request.authorName() : author.getName())
                .category(request.category())
                .imageUrl(request.imageUrl())
                .status(PostStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Post saved = postRepository.save(post);
        return toResponse(saved);
    }

    public List<PostResponse> findAll() {
        return postRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PostResponse> findByAuthor(String authorId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PostResponse> findPending() {
        return postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PENDING).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PostResponse> findPublished() {
        return postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.APPROVED).stream()
                .map(this::toResponse)
                .toList();
    }

    public PostResponse reviewPost(String postId, ReviewPostRequest request) {
        Post post = getPost(postId);
        post.setStatus(request.status());

        String feedback = request.feedback();
        if (feedback != null && feedback.isBlank()) {
            feedback = null;
        }

        String deleteReason = request.deleteReason();
        if (deleteReason != null && deleteReason.isBlank()) {
            deleteReason = null;
        }

        post.setFeedback(feedback);
        post.setDeleteReason(deleteReason);

        if (request.status() == PostStatus.APPROVED) {
            post.setFeedback(null);
            post.setDeleteReason(null);
        }

        post.setUpdatedAt(LocalDateTime.now());

        return toResponse(postRepository.save(post));
    }

    public PostResponse getById(String postId) {
        return toResponse(getPost(postId));
    }

    private Post getPost(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrada"));
    }

    private PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthorId(),
                post.getAuthorName(),
                post.getCategory(),
                post.getImageUrl(),
                post.getFeedback(),
                post.getDeleteReason(),
                post.getStatus(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
