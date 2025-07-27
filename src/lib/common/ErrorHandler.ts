import { ValiError } from 'valibot';
import { ConstraintViolationError } from 'gel';
import UserDisplayableError from './UserDisplayableError';
import ConstraintError from './ConstraintError';
import NotFoundError from '@db/NotFoundError';

export type Result<Data, Error> =
  | { data: Data; error: null; status: 'Success' }
  | { data: null; error: Error; status: 'Failure' };

export default class ErrorHandler {
  public static createResult<Data>(data: Data | null, error: unknown) {
    if (error) {
      return { data: null, error: this.handleError(error), status: 'Failure' } as Result<
        Data,
        UserDisplayableError
      >;
    }

    return { data, error: null, status: 'Success' } as Result<Data, UserDisplayableError>;
  }

  public static handleError(error: unknown): UserDisplayableError {
    // TODO: ADD BETTER ERROR LOGGING
    console.log(error);

    if (error instanceof UserDisplayableError || error instanceof NotFoundError) {
      return error;
    }

    if (error instanceof ConstraintViolationError) {
      return new ConstraintError(
        "The data provided violates the constraints defined in the schema. Please try again with different data.",
        error.message.substring(0, error.message.indexOf(' ')),
      );
    }

    if (error instanceof ValiError) {
      return new UserDisplayableError(
        'The date you provided is not valid, it is not your fault. This error has been reported to the development team.',
      );
    }

    return new UserDisplayableError('An unexpected error occurred.');
  }

  public static useCatch<Data>(
    fn: () => Data | Result<Data, UserDisplayableError>
  ): Result<Data, UserDisplayableError> {
    try {
      const data = fn();

      if (
        typeof data === 'object' &&
        data != null &&
        'data' in data &&
        'error' in data &&
        'status' in data
      ) {
        return data;
      }

      return { data, error: null, status: 'Success' };
    } catch (error) {
      return { data: null, error: this.handleError(error), status: 'Failure' };
    }
  }

  public static async useAwait<Data>(
    fn: () => Promise<Data | Result<Data, UserDisplayableError>>
  ): Promise<Result<Data, UserDisplayableError>> {
    try {
      const data = await fn();

      if (
        typeof data === 'object' &&
        data != null &&
        'data' in data &&
        'error' in data &&
        'status' in data
      ) {
        return data;
      }

      return { data, error: null, status: 'Success' };
    } catch (error) {
      return { data: null, error: this.handleError(error), status: 'Failure' };
    }
  }
}