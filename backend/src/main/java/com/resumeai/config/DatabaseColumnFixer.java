package com.resumeai.config;

import org.springframework.boot.context.event.ApplicationStartingEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DatabaseColumnFixer implements ApplicationListener<ApplicationStartingEvent> {

    private final DataSource dataSource;

    public DatabaseColumnFixer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void onApplicationEvent(ApplicationStartingEvent event) {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

            // Add column if missing
            jdbcTemplate.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name='user'
                        AND column_name='is_profile_complete'
                    ) THEN
                        ALTER TABLE "user" ADD COLUMN is_profile_complete BOOLEAN DEFAULT false;
                    END IF;
                END $$;
            """);

            // Fill nulls just in case
            jdbcTemplate.update("UPDATE \"user\" SET is_profile_complete = false WHERE is_profile_complete IS NULL");

            System.out.println("✅ Checked/Filled is_profile_complete column before Hibernate schema update.");
        } catch (Exception e) {
            System.err.println("⚠ Error while fixing is_profile_complete column: " + e.getMessage());
        }
    }
}
