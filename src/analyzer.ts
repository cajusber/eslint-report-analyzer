import { unique } from "./helpers/array.helpers";
import { ESLintReport } from "./types/eslint-report.type";
import { ESLintReportFile } from "./types/eslint-report-file.interface";
import { ESLintReportMessage } from "./types/eslint-report-message.interface";
import { logger } from "./logger";
import { RuleReport } from "./types/rule-report.interface";
import fs from "fs";

export class Analyzer {
  private readonly reportFile: string;
  private readonly report: ESLintReport;

  constructor(reportFilePath: string) {
    this.reportFile = fs.readFileSync(reportFilePath, { flag: "r", encoding: "utf8" });
    this.report = JSON.parse(this.reportFile);
  }

  private getMessages(): ESLintReportMessage[] {
    return this.report
      .map((reportFile: ESLintReportFile) => reportFile.messages)
      .flat() || [];
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

  public printReport(): void {
    logger.log("Problems:\tAuto:\t\tManually:\tManually acc.\tRule:");
    logger.logSeperatorLine(100);

    let noOfProblemsTotal: number = 0;
    let noOfAutofixableProblemsTotal: number = 0;
    let noOfManuallyFixableProblemsTotal: number = 0;

    this.getUniqueRuleIds()
      .map((ruleId: ESLintReportMessage["ruleId"]) => this.getRuleReport(ruleId))
      .sort((a: RuleReport, b: RuleReport) =>
        (a.noOfProblems - a.noOfAutofixableProblems) - (b.noOfProblems - b.noOfAutofixableProblems),
      )
      .forEach(ruleReport => {
        noOfProblemsTotal += ruleReport.noOfProblems;
        noOfAutofixableProblemsTotal += ruleReport.noOfAutofixableProblems;

        const noOfManuallyFixableProblems = ruleReport.noOfProblems - ruleReport.noOfAutofixableProblems;
        noOfManuallyFixableProblemsTotal += noOfManuallyFixableProblems;

        const text = `${ruleReport.noOfProblems}\t\t`
          + `${ruleReport.noOfAutofixableProblems}\t\t`
          + `${noOfManuallyFixableProblems}\t\t`
          + `${noOfManuallyFixableProblemsTotal}\t\t`
          + `${ruleReport.ruleId}`;

        logger.log(text);
      });

    logger.logSeperatorLine(100);
    logger.log(`${noOfProblemsTotal}\t\t${noOfAutofixableProblemsTotal}\t\t${noOfManuallyFixableProblemsTotal}\t\t-\t\tTotal`);
    logger.logNewLines();
  }
}
