// Repository Index
// Centralized exports for all repository implementations
// Note: Currently using in-memory implementations since database is removed

// Repository factory functions would be implemented here when adding persistent storage
export function createCourseRepository() {
  // TODO: Implement in-memory or file-based course repository
  throw new Error('Course repository not implemented without database')
}

export function createUserRepository() {
  // TODO: Implement in-memory or file-based user repository  
  throw new Error('User repository not implemented without database')
}