class Logger {
  isLogInfoEnabled = true;

  isLogWarningEnabled = true;

  isLogErrorEnabled = true;

  constructor() {}

  logInfo(source: string, message: string, extra?: unknown): void {
    if (this.isLogInfoEnabled) {
      this.log('INFO', source, message, extra);
    }
  }

  logWarning(source: string, message: string, extra?: unknown): void {
    if (this.isLogWarningEnabled) {
      this.log('WARNING', source, message, extra);
    }
  }

  logError(source: string, message: string, extra?: unknown): void {
    if (this.isLogErrorEnabled) {
      this.log('ERROR', source, message, extra);
    }
  }

  private log(level: string, source: string, message: string, extra: unknown): void {
    if (extra) {
      console.log(`[${level}][${source}] ${message}`, extra);
    } else {
      console.log(`[${level}][${source}] ${message}`);
    }
  }
}

export default new Logger();
