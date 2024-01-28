export class AppError extends Error{

  public statusCode: number;
  public status: string;
  public message: string;

  constructor (statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static badRequest (message: string) {
    return new AppError(400, message);
  }

  static UnauthorizedError() {
    return new AppError(401, "Пользователь не авторизован");
  }
}