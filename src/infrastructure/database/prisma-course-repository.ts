// Infrastructure: Prisma Course Repository Implementation
// Adapter implementing the CourseRepository domain interface

import { PrismaClient } from '@prisma/client'
import { CourseRepository } from '../../domain/interfaces/course-repository'
import { Course, Difficulty } from '../../domain/entities/course'
import { CourseId } from '../../domain/value-objects/course-id'
import { Money } from '../../domain/value-objects/money'
import { Duration } from '../../domain/value-objects/duration'
import { DatabaseError } from '../../domain/errors/domain-errors'

export class PrismaCourseRepository implements CourseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: CourseId): Promise<Course | null> {
    try {
      const courseData = await this.prisma.course.findUnique({
        where: { id: id.value },
        include: {
          modules: {
            include: {
              lessons: true
            },
            orderBy: { order: 'asc' }
          }
        }
      })

      return courseData ? this.toDomainEntity(courseData) : null
    } catch (error) {
      throw new DatabaseError('findById', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findBySlug(slug: string): Promise<Course | null> {
    try {
      const courseData = await this.prisma.course.findUnique({
        where: { slug },
        include: {
          modules: {
            include: {
              lessons: true
            },
            orderBy: { order: 'asc' }
          }
        }
      })

      return courseData ? this.toDomainEntity(courseData) : null
    } catch (error) {
      throw new DatabaseError('findBySlug', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      const coursesData = await this.prisma.course.findMany({
        include: {
          modules: {
            include: {
              lessons: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return coursesData.map(courseData => this.toDomainEntity(courseData))
    } catch (error) {
      throw new DatabaseError('findAll', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findPublished(): Promise<Course[]> {
    try {
      const coursesData = await this.prisma.course.findMany({
        where: { published: true },
        include: {
          modules: {
            include: {
              lessons: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return coursesData.map(courseData => this.toDomainEntity(courseData))
    } catch (error) {
      throw new DatabaseError('findPublished', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findFeatured(): Promise<Course[]> {
    try {
      const coursesData = await this.prisma.course.findMany({
        where: { 
          published: true,
          featured: true 
        },
        include: {
          modules: {
            include: {
              lessons: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return coursesData.map(courseData => this.toDomainEntity(courseData))
    } catch (error) {
      throw new DatabaseError('findFeatured', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findByDifficulty(difficulty: string): Promise<Course[]> {
    try {
      const coursesData = await this.prisma.course.findMany({
        where: { 
          published: true,
          difficulty: difficulty as any
        },
        include: {
          modules: {
            include: {
              lessons: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return coursesData.map(courseData => this.toDomainEntity(courseData))
    } catch (error) {
      throw new DatabaseError('findByDifficulty', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async save(course: Course): Promise<void> {
    try {
      const data = this.toPersistenceModel(course)

      await this.prisma.course.upsert({
        where: { id: course.id.value },
        create: data,
        update: {
          ...data,
          id: undefined // Don't update the ID
        }
      })
    } catch (error) {
      throw new DatabaseError('save', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async delete(id: CourseId): Promise<void> {
    try {
      await this.prisma.course.delete({
        where: { id: id.value }
      })
    } catch (error) {
      throw new DatabaseError('delete', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async existsBySlug(slug: string): Promise<boolean> {
    try {
      const count = await this.prisma.course.count({
        where: { slug }
      })
      return count > 0
    } catch (error) {
      throw new DatabaseError('existsBySlug', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.course.count()
    } catch (error) {
      throw new DatabaseError('count', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async countPublished(): Promise<number> {
    try {
      return await this.prisma.course.count({
        where: { published: true }
      })
    } catch (error) {
      throw new DatabaseError('countPublished', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Private mapping methods
  private toDomainEntity(data: any): Course {
    return new Course({
      id: CourseId.fromString(data.id),
      title: data.title,
      description: data.description,
      slug: data.slug,
      price: new Money(data.price, 'USD'),
      duration: Duration.fromMinutes(data.duration),
      difficulty: data.difficulty as Difficulty,
      published: data.published,
      featured: data.featured || false,
      learningObjectives: data.learningObjectives || [],
      prerequisites: data.prerequisites || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  private toPersistenceModel(course: Course): any {
    return {
      id: course.id.value,
      title: course.title,
      description: course.description,
      slug: course.slug,
      price: course.price.amount,
      duration: course.duration.minutes,
      difficulty: course.difficulty,
      published: course.published,
      featured: course.featured,
      learningObjectives: course.learningObjectives,
      prerequisites: course.prerequisites,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }
  }
}