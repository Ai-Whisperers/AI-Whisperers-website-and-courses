-- ============================================================================
-- ROLLBACK: Database Optimization Migration
-- Created: 2025-10-10
-- Purpose: Rollback all index changes from 20251010000000_database_optimization
-- ============================================================================

-- WARNING: Only use this rollback if the optimization migration causes issues
-- This will restore the database to its pre-optimization state

-- ============================================================================
-- Step 1: Drop All New Indexes
-- ============================================================================

-- Users table indexes
DROP INDEX IF EXISTS "users_role_idx";
DROP INDEX IF EXISTS "users_role_createdAt_idx";
DROP INDEX IF EXISTS "users_createdAt_idx";

-- Courses table indexes
DROP INDEX IF EXISTS "courses_difficulty_idx";
DROP INDEX IF EXISTS "courses_published_featured_createdAt_idx";
DROP INDEX IF EXISTS "courses_price_idx";
DROP INDEX IF EXISTS "courses_createdAt_idx";
DROP INDEX IF EXISTS "courses_published_catalog_idx";

-- Transactions table indexes
DROP INDEX IF EXISTS "transactions_createdAt_idx";
DROP INDEX IF EXISTS "transactions_userId_createdAt_idx";
DROP INDEX IF EXISTS "transactions_status_createdAt_idx";

-- Course progress table indexes
DROP INDEX IF EXISTS "course_progress_lastAccessedAt_idx";
DROP INDEX IF EXISTS "course_progress_userId_lastAccessedAt_idx";
DROP INDEX IF EXISTS "course_progress_incomplete_idx";

-- Lesson progress table indexes
DROP INDEX IF EXISTS "lesson_progress_lastWatchedAt_idx";
DROP INDEX IF EXISTS "lesson_progress_incomplete_idx";

-- Quiz attempts table indexes
DROP INDEX IF EXISTS "quiz_attempts_userId_quizId_startedAt_idx";
DROP INDEX IF EXISTS "quiz_attempts_userId_startedAt_idx";
DROP INDEX IF EXISTS "quiz_attempts_failed_idx";

-- Certificates table indexes
DROP INDEX IF EXISTS "certificates_userId_issuedAt_idx";

-- Full-text search
DROP INDEX IF EXISTS "courses_search_vector_idx";
ALTER TABLE courses DROP COLUMN IF EXISTS search_vector;

-- Media table indexes
DROP INDEX IF EXISTS "media_type_provider_idx";
DROP INDEX IF EXISTS "media_createdAt_idx";

-- Course analytics table indexes
DROP INDEX IF EXISTS "course_analytics_lastCalculatedAt_idx";


-- ============================================================================
-- Step 2: Recreate Removed Indexes
-- ============================================================================

-- Users table - recreate redundant email index
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");

-- Courses table - recreate redundant slug index
CREATE INDEX IF NOT EXISTS "courses_slug_idx" ON "courses"("slug");

-- Transactions table - recreate redundant providerTxnId index
CREATE INDEX IF NOT EXISTS "transactions_providerTxnId_idx" ON "transactions"("providerTxnId");

-- Course progress table - recreate low-cardinality progressPercent index
CREATE INDEX IF NOT EXISTS "course_progress_progressPercent_idx" ON "course_progress"("progressPercent");

-- Lesson progress table - recreate boolean completed index
CREATE INDEX IF NOT EXISTS "lesson_progress_completed_idx" ON "lesson_progress"("completed");

-- Certificates table - recreate redundant certificateNo index
CREATE INDEX IF NOT EXISTS "certificates_certificateNo_idx" ON "certificates"("certificateNo");


-- ============================================================================
-- Step 3: Update Statistics
-- ============================================================================

-- Update statistics after index changes
VACUUM ANALYZE;


-- ============================================================================
-- Rollback Complete
-- ============================================================================

-- Database has been restored to pre-optimization state
-- All new indexes have been removed
-- All previously removed indexes have been restored
--
-- Note: If you rolled back due to performance issues, please report the problem
-- with query execution plans and statistics to help improve future optimizations.
