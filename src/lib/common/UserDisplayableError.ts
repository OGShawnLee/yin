export default class UserDisplayableError extends Error {
  public constructor(
    message: string,
  ) {
    super(message);
    this.name = 'UserDisplayableError';
  }
}