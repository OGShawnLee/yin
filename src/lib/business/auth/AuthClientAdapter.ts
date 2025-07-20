import type { CurrentUserShape } from "@business/schema/AuthSchema";
import { YinAuthAdapter } from "$lib/YinAuth";
import AccountDAO from "@db/dao/AccountDAO";
import AuthDAO from "@db/dao/AuthDAO";
import AuthSchema from "@business/schema/AuthSchema";

export default class AuthClientAdapter extends YinAuthAdapter<CurrentUserShape, CurrentUserShape> {
  public async findCurrentUserFromDB(payload: CurrentUserShape): Promise<CurrentUserShape | null> {
    return AuthDAO.findCurrentUser(payload);
  }

  public async getRefreshTokenFromDB(payload: CurrentUserShape): Promise<number> {
    return (await AccountDAO.getOneByUserDisplayName(payload.displayName)).refreshTokenVersion;
  }

  public getRenewedPayload(payload: CurrentUserShape): CurrentUserShape {
    return { id: payload.id, name: payload.name, displayName: payload.displayName };
  }

  public isPayload(payload: unknown): payload is CurrentUserShape {
    return AuthSchema.isValidCurrentUser(payload);
  }
}
