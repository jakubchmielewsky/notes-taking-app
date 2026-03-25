import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

function hasPinoPretty(): boolean {
  try {
    require.resolve("pino-pretty");
    return true;
  } catch {
    return false;
  }
}

export const logger = pino({
  level: isDev ? "debug" : "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers.set-cookie",
    ],
    censor: "[REDACTED]",
  },
  ...(isDev && hasPinoPretty()
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            singleLine: false,
          },
        },
      }
    : {}),
});

export const createModuleLogger = (module: string) => logger.child({ module });

export const createFeatureLogger = (feature: string) =>
  logger.child({ layer: "feature", feature });

export const createIntegrationLogger = (integration: string) =>
  logger.child({ layer: "integration", integration });

export const createWorkerLogger = (worker: string, queue?: string) =>
  logger.child({
    layer: "worker",
    worker,
    ...(queue ? { queue } : {}),
  });

