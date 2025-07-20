import UserDisplayableError from "./UserDisplayableError";

export default class ConstraintError extends UserDisplayableError {
  public readonly field: string;

  public constructor(
    message: string,
    field: string
  ) {
    super(message);
    this.name = 'ConstraintError';
    this.field = field;
  }
}