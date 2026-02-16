import { fileURLToPath } from "url";
import path from "path";
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { cofactsWriter } from "./agents";
import { ConsoleLogger, LogLevel } from "@mastra/core/logger";

const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "info";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Mastra dev, the bundled file is at .mastra/output/index.mjs
// We want to point to .mastra/mastra.db
// So we go up from .mastra/output to .mastra
const databasePath = path.resolve(__dirname, "..", "mastra.db");

export const mastra = new Mastra({
  agents: {
    cofactsWriter,
  },
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: `file:${databasePath}`,
  }),
  logger: new ConsoleLogger({
    level: LOG_LEVEL,
  }),
});
