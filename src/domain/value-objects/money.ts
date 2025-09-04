// Domain Value Object: Money
// Represents monetary amounts with currency

export class Money {
  private readonly _amount: number // Amount in cents
  private readonly _currency: string

  constructor(amount: number, currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative')
    }
    if (!currency || currency.trim().length === 0) {
      throw new Error('Currency cannot be empty')
    }
    
    this._amount = Math.round(amount) // Ensure integer cents
    this._currency = currency.toUpperCase()
  }

  get amount(): number {
    return this._amount
  }

  get currency(): string {
    return this._currency
  }

  get dollars(): number {
    return this._amount / 100
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error(`Cannot add different currencies: ${this._currency} and ${other._currency}`)
    }
    return new Money(this._amount + other._amount, this._currency)
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative')
    }
    return new Money(this._amount * factor, this._currency)
  }

  formatUSD(): string {
    return `$${(this._amount / 100).toFixed(2)}`
  }

  toString(): string {
    return `${this._amount / 100} ${this._currency}`
  }

  static fromDollars(dollars: number, currency: string = 'USD'): Money {
    return new Money(Math.round(dollars * 100), currency)
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency)
  }
}