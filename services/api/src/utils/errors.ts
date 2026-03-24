export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

export class NotImplementedError extends AppError {
  constructor(message = "Not implemented") {
    super(501, message);
  }
}

export class BadGatewayError extends AppError {
  constructor(message: string) {
    super(502, message);
  }
}
