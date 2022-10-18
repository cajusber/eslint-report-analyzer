import { unique } from "./helpers/array.helpers";
import { ESLintReport } from "./types/eslint-report.type";
import { ESLintReportFile } from "./types/eslint-report-file.interface";
import { ESLintReportMessage } from "./types/eslint-report-message.interface";
import { logger } from "./logger";
import { RuleReport } from "./types/rule-report.interface";
import fs from "fs";

export class App {
  private readonly reportFile: string | undefined = undefined;
  private readonly report: ESLintReport | undefined = undefined;

  constructor(private readonly reportFilePath: string) {
    this.reportFile = fs.readFileSync(this.reportFilePath, { flag: "r", encoding: "utf8" });
    this.report = JSON.parse(this.reportFile);
  }

  private getMessages(): ESLintReportMessage[] {
    return this.report
      ?.map((reportFile: ESLintReportFile) => reportFile.messages)
      ?.flat() || [];
  }

  private getMessagesByRuleId(ruleId: ESLintReportMessage["ruleId"]): ESLintReportMessage[] {
    return this.getMessages().filter(
      (message: ESLintReportMessage) => message.ruleId === ruleId,
    );
  }

  private getFixableMessagesByRuleId(ruleId: ESLintReportMessage["ruleId"]): ESLintReportMessage[] {
    return this.getMessagesByRuleId(ruleId).filter(
      (message: ESLintReportMessage) => !!message.fix,
    );
  }

  private getUniqueRuleIds(): Array<ESLintReportMessage["ruleId"]> {
    const ruleIds = this.getMessages().map(
      (reportMessage: ESLintReportMessage) => reportMessage.ruleId,
    );

    return unique(ruleIds).sort();
  }

  private getRuleReport(ruleId: ESLintReportMessage["ruleId"]): RuleReport {
    return {
      ruleId,
      noOfProblems: this.getMessagesByRuleId(ruleId).length,
      noOfAutofixableProblems: this.getFixableMessagesByRuleId(ruleId).length,
    };
  }

  private printRuleReport(ruleReport: RuleReport): void {
    const text: string = `${ruleReport.noOfProblems}\t\t`
      + `${ruleReport.noOfAutofixableProblems}\t\t`
      + `${ruleReport.noOfProblems - ruleReport.noOfAutofixableProblems}\t\t`
      + `${ruleReport.ruleId}`;

    logger.log(text);
  }

  public print(): void {
    logger.log("Problems:\tAuto:\t\tManually:\tRule:");
    this.getUniqueRuleIds()
      .map((ruleId: ESLintReportMessage["ruleId"]) => this.getRuleReport(ruleId))
      .sort((a: RuleReport, b: RuleReport) =>
        (a.noOfProblems - a.noOfAutofixableProblems) - (b.noOfProblems - b.noOfAutofixableProblems),
      )
      .forEach(ruleReport => this.printRuleReport(ruleReport));
  }
}
