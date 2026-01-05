/**
 * Logger Utility - Centralized logging for the application
 *
 * Provides consistent logging across the app with different log levels.
 * In production, this can be connected to external logging services.
 */

interface LogData {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log general information
   */
  info(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
    // In production, send to analytics service
  }

  /**
   * Log errors
   */
  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
    // In production, send to error tracking service (Sentry, etc.)
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  /**
   * Log financial transactions (always logged regardless of environment)
   */
  transaction(type: string, data: LogData): void {
    console.log(`[TRANSACTION] ${type}:`, data);
    // In production, send to audit log service
  }

  /**
   * Log sync operations
   */
  sync(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      console.log(`[SYNC] ${message}`, data || '');
    }
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number): void {
    if (this.isDevelopment) {
      console.log(`[PERF] ${operation} took ${duration}ms`);
    }
    // In production, send to performance monitoring service
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Utility function to measure and log performance
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.performance(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, error);
    throw error;
  }
}
