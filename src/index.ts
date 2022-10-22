import { exit } from "process";
import { Analyzer } from "./analyzer";
import { logger } from "./logger";

const args: string[] = process.argv.slice(2);
const eslintReportFilePath: string | undefined = args[0];

if (!eslintReportFilePath?.length) {
  logger.logNewLines(1);
  logger.log("Error: ESLint json report file required as argument.");
  logger.logNewLines(2);
  exit(9);
}

const analyzer: Analyzer = new Analyzer(eslintReportFilePath);

analyzer.printReport();
