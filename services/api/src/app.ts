import Express from "express";
import helmet from "helmet";
import { requestLogger } from "./middlewares/requestLogger";
import { NotFoundError } from "./utils/errors";
import cookieParser from "cookie-parser";
import { globalRateLimiter } from "./middlewares/rateLimiters";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { setupSwagger } from "./config/swagger";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import { authRouter } from "./features/auth/auth.router";
import { usersRouter } from "./features/users/users.router";
import { notesRouter } from "./features/notes/notes.router";

const app = Express();

app.use(corsMiddleware);
app.use(requestLogger);
app.use(globalRateLimiter);
app.use(helmet());
app.use(Express.json({ limit: "10kb" }));
app.use(cookieParser());

setupSwagger(app);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/notes", notesRouter);

app.use((req, res, next) => {
  next(new NotFoundError(req.originalUrl));
});

app.use(globalErrorHandler);

export default app;
