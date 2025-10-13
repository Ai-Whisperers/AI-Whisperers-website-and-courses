/**
 * Prisma Course Repository Implementation
 * Concrete implementation of CourseRepository interface using Prisma ORM
 *
 * This adapter bridges the domain layer with the database layer,
 * converting between Prisma models and domain entities.
 */

import { PrismaClient, Course as PrismaCourse, Difficulty as PrismaDifficulty } from '@prisma/client'
import { CourseRepository } from '@/domain/interfaces/course-repository'
import { Course, Difficulty } from '@/domain/entities/course'
import { CourseId } from '@/domain/value-objects/course-id'
import { Money } from '@/domain/value-objects/money'
import { Duration } from '@/domain/value-objects/duration'

export class PrismaCourseRepository implements CourseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find course by ID
   */
  async findById(id: CourseId): Promise<Course | null> {
    const prismaCourse = await this.prisma.course.findUnique({
      where: { id: id.value },
    })

    return prismaCourse ? this.toDomain(prismaCourse) : null
  }

  /**
   * Find course by slug (unique identifier in URLs)
   */
  async findBySlug(slug: string): Promise<Course | null> {
    const prismaCourse = await this.prisma.course.findUnique({
      where: { slug },
    })

    return prismaCourse ? this.toDomain(prismaCourse) : null
  }

  /**
   * Find all courses (no filtering)
   */
  async findAll(): Promise<Course[]> {
    const prismaCourses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return prismaCourses.map(course => this.toDomain(course))
  }

  /**
   * Find only published courses
   */
  async findPublished(): Promise<Course[]> {
    const prismaCourses = await this.prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    return prismaCourses.map(course => this.toDomain(course))
  }

  /**
   * Find featured courses (typically for homepage)
   */
  async findFeatured(): Promise<Course[]> {
    const prismaCourses = await this.prisma.course.findMany({
      where: {
        published: true,
        featured: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return prismaCourses.map(course => this.toDomain(course))
  }

  /**
   * Find courses by difficulty level
   */
  async findByDifficulty(difficulty: string): Promise<Course[]> {
    const prismaCourses = await this.prisma.course.findMany({
      where: {
        published: true,
        difficulty: difficulty as PrismaDifficulty,
      },
      orderBy: { createdAt: 'desc' },
    })

    return prismaCourses.map(course => this.toDomain(course))
  }

  /**
   * Save course (create or update)
   * Uses upsert to handle both cases
   */
  async save(course: Course): Promise<void> {
    const prismaData = this.toPrisma(course)

    await this.prisma.course.upsert({
      where: { id: course.id.value },
      create: prismaData,
      update: prismaData,
    })
  }

  /**
   * Delete course by ID
   * Note: This will cascade delete related modules, lessons, etc.
   */
  async delete(id: CourseId): Promise<void> {
    await this.prisma.course.delete({
      where: { id: id.value },
    })
  }

  /**
   * Check if course with slug exists
   * Useful for slug uniqueness validation
   */
  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.course.count({
      where: { slug },
    })

    return count > 0
  }

  /**
   * Count total courses
   */
  async count(): Promise<number> {
    return this.prisma.course.count()
  }

  /**
   * Count only published courses
   */
  async countPublished(): Promise<number> {
    return this.prisma.course.count({
      where: { published: true },
    })
  }

  // ============================================================================
  // Mapper Methods: Prisma ↔ Domain
  // ============================================================================

  /**
   * Convert Prisma model to Domain entity
   */
  private toDomain(prismaCourse: PrismaCourse): Course {
    return new Course({
      id: new CourseId(prismaCourse.id),
      title: prismaCourse.title,
      description: prismaCourse.description,
      slug: prismaCourse.slug,
      price: new Money(
        parseFloat(prismaCourse.price.toString()),
        prismaCourse.currency
      ),
      duration: new Duration(prismaCourse.durationHours, 'hours'),
      difficulty: this.mapDifficulty(prismaCourse.difficulty),
      published: prismaCourse.published,
      featured: prismaCourse.featured,
      learningObjectives: prismaCourse.learningObjectives,
      prerequisites: prismaCourse.prerequisites,
      createdAt: prismaCourse.createdAt,
      updatedAt: prismaCourse.updatedAt,
    })
  }

  /**
   * Convert Domain entity to Prisma model data
   */
  private toPrisma(course: Course) {
    return {
      id: course.id.value,
      title: course.title,
      description: course.description,
      slug: course.slug,
      price: course.price.amount,
      currency: course.price.currency,
      durationHours: course.duration.hours,
      difficulty: course.difficulty as PrismaDifficulty,
      published: course.published,
      featured: course.featured,
      learningObjectives: [...course.learningObjectives],
      prerequisites: [...course.prerequisites],
      // Prisma handles timestamps automatically, but we can override if needed
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }
  }

  /**
   * Map Prisma difficulty enum to Domain difficulty enum
   */
  private mapDifficulty(prismaDifficulty: PrismaDifficulty): Difficulty {
    switch (prismaDifficulty) {
      case 'BEGINNER':
        return Difficulty.BEGINNER
      case 'INTERMEDIATE':
        return Difficulty.INTERMEDIATE
      case 'ADVANCED':
        return Difficulty.ADVANCED
      case 'EXPERT':
        return Difficulty.EXPERT
      default:
        throw new Error(`Unknown difficulty level: ${prismaDifficulty}`)
    }
  }
}

/**
 * Factory function to create repository instance
 * This is useful for dependency injection
 */
export function createPrismaCourseRepository(prisma: PrismaClient): CourseRepository {
  return new PrismaCourseRepository(prisma)
}
