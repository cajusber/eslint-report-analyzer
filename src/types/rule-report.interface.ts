import { ESLintReportMessage } from "./eslint-report-message.interface";

export interface RuleReport {
  ruleId: ESLintReportMessage["ruleId"];
  noOfProblems: number;
  noOfAutofixableProblems: number;
}
