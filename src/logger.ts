/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export class Logger {
  public log(...args: any): void {
    console.log(...args);
  }

  public logSeperatorLine(length: number): void {
    this.log(Array(length).join("-"));
  }

  public logNewLines(noOfNewLines: number = 1): void {
    this.log(Array(noOfNewLines).join("\r\n"));
  }
}

export const logger = new Logger();
