package com.software.TPE.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableConfigurationProperties(MongoConfig.MongoConnectionProperties.class)
public class MongoConfig {

    private final MongoConnectionProperties properties;

    public MongoConfig(MongoConnectionProperties properties) {
        this.properties = properties;
    }

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoClientSettingsBuilderCustomizer() {
        return builder -> applyConnectionString(builder, properties.resolveConnectionString());
    }

    private void applyConnectionString(MongoClientSettings.Builder builder, String connectionString) {
        builder.applyConnectionString(new ConnectionString(connectionString));
    }

    @ConfigurationProperties(prefix = "mongodb")
    public static class MongoConnectionProperties {
        /**
         * Fully qualified MongoDB connection string. When defined it overrides the
         * composed connection string.
         */
        private String connectionString;
        /**
         * Connection scheme (for example mongodb or mongodb+srv for Atlas clusters).
         */
        private String scheme = "mongodb";
        private String host = "localhost";
        private Integer port = 27017;
        private String database = "thepressengine";
        private String username;
        private String password;
        /**
         * Additional URI parameters appended after the database name.
         */
        private String params = "";
        /**
         * Enables TLS connections when building the composed connection string.
         */
        private Boolean tlsEnabled;

        public String getConnectionString() {
            return connectionString;
        }

        public void setConnectionString(String connectionString) {
            this.connectionString = connectionString;
        }

        public String getScheme() {
            return scheme;
        }

        public void setScheme(String scheme) {
            this.scheme = scheme;
        }

        public String getHost() {
            return host;
        }

        public void setHost(String host) {
            this.host = host;
        }

        public Integer getPort() {
            return port;
        }

        public void setPort(Integer port) {
            this.port = port;
        }

        public String getDatabase() {
            return database;
        }

        public void setDatabase(String database) {
            this.database = database;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getParams() {
            return params;
        }

        public void setParams(String params) {
            this.params = params;
        }

        public Boolean getTlsEnabled() {
            return tlsEnabled;
        }

        public void setTlsEnabled(Boolean tlsEnabled) {
            this.tlsEnabled = tlsEnabled;
        }

        private String resolveConnectionString() {
            if (StringUtils.hasText(connectionString)) {
                return connectionString;
            }

            StringBuilder builder = new StringBuilder();
            builder.append(StringUtils.hasText(scheme) ? scheme : "mongodb").append("://");

            String credentials = buildCredentialSegment();
            if (StringUtils.hasText(credentials)) {
                builder.append(credentials).append('@');
            }

            builder.append(host);
            if (port != null && port > 0 && !scheme.toLowerCase().contains("+srv")) {
                builder.append(':').append(port);
            }

            builder.append('/');
            builder.append(StringUtils.hasText(database) ? database : "test");

            String queryParams = buildQueryParams();
            if (StringUtils.hasText(queryParams)) {
                builder.append('?').append(queryParams);
            }

            return builder.toString();
        }

        private String buildCredentialSegment() {
            if (!StringUtils.hasText(username)) {
                return null;
            }

            String encodedUsername = urlEncode(username);
            String encodedPassword = StringUtils.hasText(password) ? urlEncode(password) : "";
            return encodedPassword.isEmpty() ? encodedUsername : encodedUsername + ':' + encodedPassword;
        }

        private String urlEncode(String value) {
            return URLEncoder.encode(value, StandardCharsets.UTF_8);
        }

        private String buildQueryParams() {
            String trimmedParams = params;
            if (StringUtils.hasText(trimmedParams) && trimmedParams.startsWith("?")) {
                trimmedParams = trimmedParams.substring(1);
            }

            StringBuilder builder = new StringBuilder();
            if (StringUtils.hasText(trimmedParams)) {
                builder.append(trimmedParams);
            }

            if (Boolean.TRUE.equals(tlsEnabled) && !containsTlsParameter(builder)) {
                if (builder.length() > 0) {
                    builder.append('&');
                }
                builder.append("tls=true");
            }

            return builder.toString();
        }

        private boolean containsTlsParameter(StringBuilder builder) {
            String value = builder.toString().toLowerCase();
            return value.contains("tls=") || value.contains("ssl=");
        }
    }
}
