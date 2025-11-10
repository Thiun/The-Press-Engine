package com.software.TPE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class ThePressEngineApplication {

        public static void main(String[] args) {
                SpringApplication.run(ThePressEngineApplication.class, args);
        }

}
