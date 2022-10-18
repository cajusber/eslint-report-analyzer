/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export class Logger {
  public log(...args: any): void {
    console.log(...args);
  }
}

export const logger = new Logger();
