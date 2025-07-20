import type { Cookies, Handle } from '@sveltejs/kit';
import JWT from 'jsonwebtoken';
import BCrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';
import { integer, number, object, parse, pipe } from 'valibot';

interface JWTPayload {
  id: string;
}

interface YinAuthConfiguration {
  ACCESS_TOKEN: string;
  ACCESS_TOKEN_NAME: string;
  ACCESS_TOKEN_EXPIRATION: JWT.SignOptions['expiresIn'];
  REFRESH_TOKEN: string;
  REFRESH_TOKEN_NAME: string;
  REFRESH_TOKEN_EXPIRATION: JWT.SignOptions['expiresIn'];
  SIGN_IN_ROUTE: string;
  SIGN_UP_ROUTE: string;
  PROTECTED_ROUTES: string[];
}

type Result<Data, Error> = { data: Data, error: null, status: "Success" } | { data: null, error: Error, status: "Failure" };

interface ErrorHandler {
  useAwait<Data>(fn: () => Promise<Data>): Promise<Result<Data, unknown>>;
  useCatch<Data>(fn: () => Data): Result<Data, unknown>;
}

export abstract class YinAuthAdapter<Payload extends JWTPayload, CurrentUser> {
  public abstract findCurrentUserFromDB(unknown: Payload): Promise<CurrentUser | null>;
  public abstract getRefreshTokenFromDB(payload: Payload): Promise<number>;
  public abstract getRenewedPayload(payload: Payload): Payload;
  public abstract isPayload(payload: unknown): payload is Payload;
}

export class YinAuthCrypto {
  public static createHashedPassword(password: string): Promise<string> {
    return BCrypt.hash(password, 8);
  }

  public static hasPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
    return BCrypt.compare(password, hashedPassword);
  }
}

export class YinAuthClient<Payload extends JWTPayload, CurrentUser> {
  private static readonly REFRESH_TOKEN_VERSION_SCHEMA = object({
    version: pipe(
      number("Refresh Token Version must be a number"),
      integer("Refresh Token Version must be an integer")
    )
  });

  public constructor(
    private readonly ADAPTER: YinAuthAdapter<Payload, CurrentUser>,
    public readonly CONFIGURATION: YinAuthConfiguration,
    private readonly ERROR_HANDLER: ErrorHandler
  ) { }

  public createHandleFunction(): Handle {
    const self = this;
    return async function handle(input) {
      const payload = await self.findAuthPayloadFromCookies(input.event.cookies);
      const route = input.event.route.id;

      if (YinAuthClient.isNullish(payload)) {
        if (route && self.isInProtectedRoute(route)) {
          throw redirect(302, self.CONFIGURATION.SIGN_IN_ROUTE);
        }
      }

      if (payload && (route === self.CONFIGURATION.SIGN_IN_ROUTE || route === self.CONFIGURATION.SIGN_UP_ROUTE)) {
        throw redirect(302, '/');
      }

      return input.resolve(input.event);
    };
  }

  public async findAuthPayloadFromCookies(cookies: Cookies): Promise<Payload | null> {
    const initialCookie = cookies.get(this.CONFIGURATION.ACCESS_TOKEN_NAME);

    if (YinAuthClient.isNullish(initialCookie) || YinAuthClient.isEmptyString(initialCookie)) {
      return null;
    }

    const { data, error } = this.ERROR_HANDLER.useCatch(() => JWT.verify(initialCookie, this.CONFIGURATION.ACCESS_TOKEN));

    if (data && this.ADAPTER.isPayload(data)) {
      return data;
    }

    const decoded = JWT.decode(initialCookie);
    if (error instanceof JWT.TokenExpiredError && this.ADAPTER.isPayload(decoded)) {
      const refreshed = await this.getRefreshAuthPayload(cookies, decoded as Payload);

      if (refreshed) {
        return refreshed;
      }
    }

    this.deleteAuthCookies(cookies);
    return null;
  }

  private findRefreshTokenFromCookies(cookies: Cookies): number | null {
    const initialCookie = cookies.get(this.CONFIGURATION.REFRESH_TOKEN_NAME);

    if (YinAuthClient.isNullish(initialCookie) || YinAuthClient.isEmptyString(initialCookie)) {
      return null;
    }

    const { data } = this.ERROR_HANDLER.useCatch(() => {
      return parse(YinAuthClient.REFRESH_TOKEN_VERSION_SCHEMA, JWT.verify(initialCookie, this.CONFIGURATION.REFRESH_TOKEN));
    });

    if (data) {
      return data.version;
    }

    this.deleteAuthCookies(cookies);
    return null;
  }

  public findCurrentUserFromDB(
    cookies: Cookies
  ): Promise<Result<CurrentUser | null, unknown>> {
    return this.ERROR_HANDLER.useAwait(async () => {
      const payload = await this.findAuthPayloadFromCookies(cookies);
      return payload ? this.ADAPTER.findCurrentUserFromDB(payload) : null;
    });
  }

  public async getAuthPayloadFromCookies(cookies: Cookies): Promise<Payload> {
    const payload = await this.findAuthPayloadFromCookies(cookies);

    if (payload) {
      return payload;
    }

    throw redirect(302, this.CONFIGURATION.SIGN_IN_ROUTE);
  }

  public async getCurrentUserFromDB(cookies: Cookies): Promise<CurrentUser> {
    const user = await this.findCurrentUserFromDB(cookies);

    if (user.error || YinAuthClient.isNullish(user.data)) {
      this.deleteAuthCookies(cookies);
      throw redirect(302, this.CONFIGURATION.SIGN_IN_ROUTE);
    }

    if (user.data) {
      return user.data;
    }

    throw redirect(302, this.CONFIGURATION.SIGN_IN_ROUTE);
  }

  private async getRefreshAuthPayload(
    cookies: Cookies,
    decoded: Payload
  ): Promise<Payload | null> {
    const refreshTokenFromCookies = this.findRefreshTokenFromCookies(cookies);

    if (YinAuthClient.isNullish(refreshTokenFromCookies)) {
      return null;
    }

    const { data: refreshTokenFromDB } = await this.ERROR_HANDLER.useAwait(() => this.ADAPTER.getRefreshTokenFromDB(decoded));

    if (refreshTokenFromDB === refreshTokenFromCookies) {
      const renewed = this.ADAPTER.getRenewedPayload(decoded);
      this.setAccessCookie(cookies, renewed);
      return renewed;
    }

    return null;
  }

  private static isNullish(value: unknown): value is null | undefined {
    return value === null || value === undefined;
  }

  private static isEmptyString(str: string) {
    return str.trim() === '';
  }

  private isInProtectedRoute(route: string): boolean {
    return this.CONFIGURATION.PROTECTED_ROUTES.some((it) => route.includes(it));
  }

  private createAccessToken(payload: Payload): string {
    return JWT.sign(payload, this.CONFIGURATION.ACCESS_TOKEN, {
      expiresIn: this.CONFIGURATION.ACCESS_TOKEN_EXPIRATION,
    });
  }

  private createRefreshToken(refreshTokenVersion: number): string {
    return JWT.sign({ version: refreshTokenVersion }, this.CONFIGURATION.REFRESH_TOKEN, {
      expiresIn: this.CONFIGURATION.REFRESH_TOKEN_EXPIRATION,
    });
  }

  private deleteAuthCookies(cookies: Cookies): void {
    cookies.set(this.CONFIGURATION.ACCESS_TOKEN_NAME, '', {
      expires: new Date(Date.now() - 3600),
      httpOnly: true,
      secure: true,
      path: '/',
    });
    cookies.set(this.CONFIGURATION.REFRESH_TOKEN_NAME, '', {
      expires: new Date(Date.now() - 3600),
      httpOnly: true,
      secure: true,
      path: '/',
    });
  }

  private setAccessCookie(cookies: Cookies, payload: Payload): void {
    cookies.set(this.CONFIGURATION.ACCESS_TOKEN_NAME, this.createAccessToken(payload), {
      httpOnly: true,
      secure: true,
      path: '/',
    });
  }

  private setRefreshCookie(cookies: Cookies, refreshTokenVersion: number): void {
    cookies.set(this.CONFIGURATION.REFRESH_TOKEN_NAME, this.createRefreshToken(refreshTokenVersion), {
      httpOnly: true,
      secure: true,
      path: '/',
    });
  }

  public signIn(cookies: Cookies, payload: Payload, refreshTokenVersion: number): void {
    this.setAccessCookie(cookies, payload);
    this.setRefreshCookie(cookies, refreshTokenVersion);
  }

  public signOut(cookies: Cookies): void {
    this.deleteAuthCookies(cookies);
  }
}
