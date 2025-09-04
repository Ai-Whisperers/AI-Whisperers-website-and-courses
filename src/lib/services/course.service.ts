// Application Service: Course Service
// Orchestrates course-related business operations

import { CourseRepository } from '../../domain/interfaces/course-repository'
import { Course, Difficulty } from '../../domain/entities/course'
import { CourseId } from '../../domain/value-objects/course-id'
import { Money } from '../../domain/value-objects/money'
import { Duration } from '../../domain/value-objects/duration'
import { CourseNotFoundError, CourseAlreadyExistsError } from '../../domain/errors/domain-errors'

export interface CreateCourseRequest {
  title: string
  description: string
  slug: string
  price: number
  duration: number
  difficulty: Difficulty
  learningObjectives: string[]
  prerequisites: string[]
}

export interface UpdateCourseRequest {
  id: string
  title?: string
  description?: string
  price?: number
  duration?: number
  difficulty?: Difficulty
  learningObjectives?: string[]
  prerequisites?: string[]
}

export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async getAllCourses(): Promise<Course[]> {
    return await this.courseRepository.findAll()
  }

  async getPublishedCourses(): Promise<Course[]> {
    return await this.courseRepository.findPublished()
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return await this.courseRepository.findFeatured()
  }

  async getCourseById(id: string): Promise<Course> {
    const courseId = CourseId.fromString(id)
    const course = await this.courseRepository.findById(courseId)
    
    if (!course) {
      throw new CourseNotFoundError(id)
    }
    
    return course
  }

  async getCourseBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepository.findBySlug(slug)
    
    if (!course) {
      throw new CourseNotFoundError(slug)
    }
    
    return course
  }

  async getCoursesByDifficulty(difficulty: Difficulty): Promise<Course[]> {
    return await this.courseRepository.findByDifficulty(difficulty)
  }

  async createCourse(request: CreateCourseRequest): Promise<Course> {
    // Check if slug already exists
    const slugExists = await this.courseRepository.existsBySlug(request.slug)
    if (slugExists) {
      throw new CourseAlreadyExistsError(request.slug)
    }

    // Create new course entity
    const course = new Course({
      id: CourseId.fromString(crypto.randomUUID()),
      title: request.title,
      description: request.description,
      slug: request.slug,
      price: Money.fromDollars(request.price),
      duration: Duration.fromMinutes(request.duration),
      difficulty: request.difficulty,
      published: false, // New courses start unpublished
      featured: false,
      learningObjectives: request.learningObjectives,
      prerequisites: request.prerequisites,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await this.courseRepository.save(course)
    return course
  }

  async updateCourse(request: UpdateCourseRequest): Promise<Course> {
    const courseId = CourseId.fromString(request.id)
    const course = await this.courseRepository.findById(courseId)
    
    if (!course) {
      throw new CourseNotFoundError(request.id)
    }

    // Update course properties
    if (request.title) {
      course.updateTitle(request.title)
    }
    
    if (request.description) {
      course.updateDescription(request.description)
    }
    
    if (request.price !== undefined) {
      course.updatePrice(Money.fromDollars(request.price))
    }

    // Save updated course
    await this.courseRepository.save(course)
    return course
  }

  async publishCourse(id: string): Promise<Course> {
    const courseId = CourseId.fromString(id)
    const course = await this.courseRepository.findById(courseId)
    
    if (!course) {
      throw new CourseNotFoundError(id)
    }

    course.publish()
    await this.courseRepository.save(course)
    return course
  }

  async unpublishCourse(id: string): Promise<Course> {
    const courseId = CourseId.fromString(id)
    const course = await this.courseRepository.findById(courseId)
    
    if (!course) {
      throw new CourseNotFoundError(id)
    }

    course.unpublish()
    await this.courseRepository.save(course)
    return course
  }

  async setFeaturedCourse(id: string, featured: boolean): Promise<Course> {
    const courseId = CourseId.fromString(id)
    const course = await this.courseRepository.findById(courseId)
    
    if (!course) {
      throw new CourseNotFoundError(id)
    }

    course.setFeatured(featured)
    await this.courseRepository.save(course)
    return course
  }

  async deleteCourse(id: string): Promise<void> {
    const courseId = CourseId.fromString(id)
    const course = await this.courseRepository.findById(courseId)
    
    if (!course) {
      throw new CourseNotFoundError(id)
    }

    await this.courseRepository.delete(courseId)
  }

  async getCourseStats(): Promise<{
    totalCourses: number
    publishedCourses: number
    featuredCourses: number
  }> {
    const [totalCourses, publishedCourses, featuredCourses] = await Promise.all([
      this.courseRepository.count(),
      this.courseRepository.countPublished(),
      this.courseRepository.findFeatured().then(courses => courses.length)
    ])

    return {
      totalCourses,
      publishedCourses,
      featuredCourses
    }
  }
}