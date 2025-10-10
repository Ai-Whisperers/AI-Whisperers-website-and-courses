/**
 * Centralized Logger Utility
 * Provides consistent logging across the application with environment-aware output
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Format log message with timestamp and context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context)}`
    }

    return `${prefix} ${message}`
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context))
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  /**
   * Log error messages (always logged)
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context }

    if (error instanceof Error) {
      errorContext.error = error.message
      errorContext.stack = this.isDevelopment ? error.stack : undefined
    } else if (error) {
      errorContext.error = String(error)
    }

    console.error(this.formatMessage('error', message, errorContext))
  }

  /**
   * Log API route errors with request context
   */
  apiError(
    endpoint: string,
    error: Error | unknown,
    context?: LogContext
  ): void {
    this.error(`API Error: ${endpoint}`, error, {
      endpoint,
      ...context,
    })
  }

  /**
   * Log API route success in development
   */
  apiSuccess(
    endpoint: string,
    context?: LogContext
  ): void {
    if (this.isDevelopment) {
      this.info(`API Success: ${endpoint}`, { endpoint, ...context })
    }
  }

  /**
   * Create a scoped logger for a specific module
   */
  scope(moduleName: string): ScopedLogger {
    return new ScopedLogger(this, moduleName)
  }
}

/**
 * Scoped logger for module-specific logging
 */
class ScopedLogger {
  constructor(
    private logger: Logger,
    private moduleName: string
  ) {}

  private addScope(context?: LogContext): LogContext {
    return {
      module: this.moduleName,
      ...context,
    }
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, this.addScope(context))
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, this.addScope(context))
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, this.addScope(context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.logger.error(message, error, this.addScope(context))
  }

  apiError(endpoint: string, error: Error | unknown, context?: LogContext): void {
    this.logger.apiError(endpoint, error, this.addScope(context))
  }

  apiSuccess(endpoint: string, context?: LogContext): void {
    this.logger.apiSuccess(endpoint, this.addScope(context))
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for external use
export type { LogLevel, LogContext }
