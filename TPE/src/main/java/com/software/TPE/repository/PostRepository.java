package com.software.TPE.repository;

import com.software.TPE.model.Post;
import com.software.TPE.model.PostStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    List<Post> findByStatusOrderByCreatedAtDesc(PostStatus status);
}
