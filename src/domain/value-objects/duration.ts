// Domain Value Object: Duration
// Represents time duration in various units

export type DurationUnit = 'minutes' | 'hours' | 'days'

export class Duration {
  private readonly _minutes: number

  constructor(value: number, unit: DurationUnit = 'minutes') {
    if (value < 0) {
      throw new Error('Duration cannot be negative')
    }

    switch (unit) {
      case 'minutes':
        this._minutes = Math.round(value)
        break
      case 'hours':
        this._minutes = Math.round(value * 60)
        break
      case 'days':
        this._minutes = Math.round(value * 24 * 60)
        break
      default:
        throw new Error(`Invalid duration unit: ${unit}`)
    }
  }

  get minutes(): number {
    return this._minutes
  }

  get hours(): number {
    return this._minutes / 60
  }

  get days(): number {
    return this._minutes / (24 * 60)
  }

  equals(other: Duration): boolean {
    return this._minutes === other._minutes
  }

  add(other: Duration): Duration {
    return new Duration(this._minutes + other._minutes, 'minutes')
  }

  formatHumanReadable(): string {
    if (this._minutes < 60) {
      return `${this._minutes} minutes`
    }
    
    const hours = Math.floor(this._minutes / 60)
    const remainingMinutes = this._minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    }
    
    return `${hours}h ${remainingMinutes}m`
  }

  toString(): string {
    return this.formatHumanReadable()
  }

  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes, 'minutes')
  }

  static fromHours(hours: number): Duration {
    return new Duration(hours, 'hours')
  }
}