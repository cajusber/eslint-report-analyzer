import { exit } from "process";
import { App } from "./app";
import { logger } from "./logger";

const args: string[] = process.argv.slice(2);
const eslintReportFilePath: string | undefined = args[0];

if (!eslintReportFilePath?.length) {
  logger.log("\r\n\r\nESLint json report file required as argument.\r\n\r\n");
  exit(9);
}

const app = new App(eslintReportFilePath);

app.print();
