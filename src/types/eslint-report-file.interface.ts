import { ESLintReportMessage } from "./eslint-report-message.interface";

export interface ESLintReportFile {
  filePath: string;
  messages: ESLintReportMessage[];
}
