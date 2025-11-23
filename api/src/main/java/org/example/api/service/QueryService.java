package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class QueryService {
    private final JdbcTemplate jdbcTemplate;

    // Regex pattern to validate SELECT-only queries
    private static final Pattern SELECT_PATTERN = Pattern.compile(
            "^\\s*SELECT\\s+.*$",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    /**
     * Execute a read-only SQL query
     * @param query SQL query to execute (must be a SELECT query)
     * @return List of result rows as maps
     * @throws IllegalArgumentException if query is not a SELECT statement
     */
    public List<Map<String, Object>> executeReadOnlyQuery(String query) {
        // Validate that this is a SELECT query
        if (!SELECT_PATTERN.matcher(query).matches()) {
            throw new IllegalArgumentException("Only SELECT queries are allowed");
        }

        // Execute the query
        return jdbcTemplate.queryForList(query);
    }
}