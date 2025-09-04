// Domain Entity: Course
// Core business entity representing an educational course

import { CourseId } from '../value-objects/course-id'
import { Money } from '../value-objects/money'
import { Duration } from '../value-objects/duration'

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE', 
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface CourseProps {
  id: CourseId
  title: string
  description: string
  slug: string
  price: Money
  duration: Duration
  difficulty: Difficulty
  published: boolean
  featured?: boolean
  learningObjectives: string[]
  prerequisites: string[]
  createdAt: Date
  updatedAt: Date
}

export class Course {
  private readonly _id: CourseId
  private _title: string
  private _description: string
  private _slug: string
  private _price: Money
  private _duration: Duration
  private _difficulty: Difficulty
  private _published: boolean
  private _featured: boolean
  private _learningObjectives: string[]
  private _prerequisites: string[]
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(props: CourseProps) {
    this.validateTitle(props.title)
    this.validateSlug(props.slug)
    this.validateLearningObjectives(props.learningObjectives)

    this._id = props.id
    this._title = props.title
    this._description = props.description
    this._slug = props.slug
    this._price = props.price
    this._duration = props.duration
    this._difficulty = props.difficulty
    this._published = props.published
    this._featured = props.featured ?? false
    this._learningObjectives = [...props.learningObjectives]
    this._prerequisites = [...props.prerequisites]
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  // Getters
  get id(): CourseId {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get description(): string {
    return this._description
  }

  get slug(): string {
    return this._slug
  }

  get price(): Money {
    return this._price
  }

  get duration(): Duration {
    return this._duration
  }

  get difficulty(): Difficulty {
    return this._difficulty
  }

  get published(): boolean {
    return this._published
  }

  get featured(): boolean {
    return this._featured
  }

  get learningObjectives(): readonly string[] {
    return [...this._learningObjectives]
  }

  get prerequisites(): readonly string[] {
    return [...this._prerequisites]
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  // Business Logic Methods
  canEnroll(): boolean {
    return this._published
  }

  isFree(): boolean {
    return this._price.amount === 0
  }

  isAdvanced(): boolean {
    return this._difficulty === Difficulty.ADVANCED || this._difficulty === Difficulty.EXPERT
  }

  getDifficultyLevel(): string {
    switch (this._difficulty) {
      case Difficulty.BEGINNER:
        return 'Beginner Friendly'
      case Difficulty.INTERMEDIATE:
        return 'Intermediate Level'
      case Difficulty.ADVANCED:
        return 'Advanced Level'
      case Difficulty.EXPERT:
        return 'Expert Level'
      default:
        return 'Unknown Level'
    }
  }

  // Update Methods
  updateTitle(title: string): void {
    this.validateTitle(title)
    this._title = title
    this.updateTimestamp()
  }

  updateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error('Course description cannot be empty')
    }
    this._description = description.trim()
    this.updateTimestamp()
  }

  updatePrice(price: Money): void {
    this._price = price
    this.updateTimestamp()
  }

  publish(): void {
    this._published = true
    this.updateTimestamp()
  }

  unpublish(): void {
    this._published = false
    this.updateTimestamp()
  }

  setFeatured(featured: boolean): void {
    this._featured = featured
    this.updateTimestamp()
  }

  addLearningObjective(objective: string): void {
    if (!objective || objective.trim().length === 0) {
      throw new Error('Learning objective cannot be empty')
    }
    if (this._learningObjectives.includes(objective.trim())) {
      throw new Error('Learning objective already exists')
    }
    this._learningObjectives.push(objective.trim())
    this.updateTimestamp()
  }

  removeLearningObjective(objective: string): void {
    const index = this._learningObjectives.indexOf(objective)
    if (index === -1) {
      throw new Error('Learning objective not found')
    }
    this._learningObjectives.splice(index, 1)
    this.updateTimestamp()
  }

  // Private Validation Methods
  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Course title cannot be empty')
    }
    if (title.length > 200) {
      throw new Error('Course title cannot exceed 200 characters')
    }
  }

  private validateSlug(slug: string): void {
    if (!slug || slug.trim().length === 0) {
      throw new Error('Course slug cannot be empty')
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error('Course slug must contain only lowercase letters, numbers, and hyphens')
    }
  }

  private validateLearningObjectives(objectives: string[]): void {
    if (!objectives || objectives.length === 0) {
      throw new Error('Course must have at least one learning objective')
    }
    if (objectives.length > 10) {
      throw new Error('Course cannot have more than 10 learning objectives')
    }
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date()
  }

  // Equality
  equals(other: Course): boolean {
    return this._id.equals(other._id)
  }
}