// Domain Interface: CourseRepository
// Port defining the contract for course persistence

import { Course } from '../entities/course'
import { CourseId } from '../value-objects/course-id'

export interface CourseRepository {
  // Query methods
  findById(id: CourseId): Promise<Course | null>
  findBySlug(slug: string): Promise<Course | null>
  findAll(): Promise<Course[]>
  findPublished(): Promise<Course[]>
  findFeatured(): Promise<Course[]>
  findByDifficulty(difficulty: string): Promise<Course[]>
  
  // Command methods  
  save(course: Course): Promise<void>
  delete(id: CourseId): Promise<void>
  
  // Utility methods
  existsBySlug(slug: string): Promise<boolean>
  count(): Promise<number>
  countPublished(): Promise<number>
}