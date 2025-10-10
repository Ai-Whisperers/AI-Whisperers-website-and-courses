// Domain Value Object: CourseId
// Following DDD principles for strong typing

export class CourseId {
  private readonly _value: string

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('CourseId cannot be empty')
    }
    this._value = value.trim()
  }

  get value(): string {
    return this._value
  }

  equals(other: CourseId): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  static fromString(value: string): CourseId {
    return new CourseId(value)
  }
}