type ErrorName =
  | "NotFoundError"
  | "AlreadyExistsException"
  | "NotAllowedError"
  | "ValidationError"
  | "SequelizeUniqueConstraintError";

export class AppError extends Error {
  constructor(readonly name: ErrorName, message: string) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const httpErrorHandler = (err: any) => {
  const response = {
    status: false,
    message: err.message ?? "Internal server error",
    data: null,
  };
  let statusCode = 500;
  switch (true) {
    case err.name === "NotFoundError":
      statusCode = 404;
      response.message = err.message ?? "Resource not found";
      break;
    case err.name === "ForbiddenError":
      response.message = err.message ?? "Forbidden request";
      statusCode = 403;
      break;
    case err.name === "AlreadyExistsException" ||
      err.name === "NotAllowedError":
      statusCode = 409;
      response.message = err.message ?? "Invalid request";
      break;
    case err.name === "AuthError" ||
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError":
      statusCode = 401;
      response.message = err.message ?? "Authentication failed";
      break;
    case err.name === "ValidationError":
      statusCode = 400;
      response.message = err.message ?? "Validation failed";
      break;
    case err.name === "ZodError":
      statusCode = 400;
      response.message = "Validation failed";
      response.data = err;
      break;
    case err.name === "SequelizeUniqueConstraintError":
      statusCode = 400;
      response.message = err.original;
      response.data = err.errors;
      break;
  }
  return { statusCode, response };
};
