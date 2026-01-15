package com.software.TPE.repository;

import com.software.TPE.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
    List<Comment> findAllByOrderByCreatedAtDesc();
}
