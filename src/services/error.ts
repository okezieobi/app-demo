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
